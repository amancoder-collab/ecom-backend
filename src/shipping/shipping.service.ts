import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CartService } from 'src/module/customer/cart/cart.service';
import { OrderService } from 'src/module/customer/order/order.service';
import { PrismaService } from 'src/module/prisma/prisma.service';
import { CalculateShippingDto } from './dto/calculate-shipping.dto';
import { CancelOrderDto } from './dto/cancel-order.dto';
import { CreateShipRocketOrderDto } from './dto/create-order.dto';
import { GenerateAWBDto } from './dto/generate-awb.dto';
import { SchedulePickupDto } from './dto/schedule-pickup.dto';
import {
  ICourierCompany,
  ICourierServiceabilityResponse,
  ICreateShipRocketOrderResponse,
  IPickupLocationsResponse,
  IPincodeValidationResponse,
  ISchedulePickupResponse,
  IShipRocketGenerateAWBResponse,
  IShipRocketOrdersResponse,
} from './interface/shiprocket-responses';
import { ShipRocketApiService } from './shiprocket-api.service';

@Injectable()
export class ShippingService {
  constructor(
    @Inject(forwardRef(() => CartService))
    private readonly cartService: CartService,
    @Inject(forwardRef(() => OrderService))
    private readonly orderService: OrderService,
    private readonly httpService: HttpService,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly shiprocketApiService: ShipRocketApiService,
  ) {}

  // private async getValidToken(): Promise<string> {
  //   const tokenEntity = await this.prismaService.shipRocketToken.findFirst({
  //     where: { expiresAt: { gt: new Date() } },
  //     orderBy: { expiresAt: 'desc' },
  //   });

  //   if (tokenEntity) {
  //     return tokenEntity.token;
  //   }

  //   return this.generateNewToken();
  // }

  // private async generateNewToken(): Promise<string> {
  //   const response = await this.httpService
  //     .post('https://apiv2.shiprocket.in/v1/external/auth/login', {
  //       email: this.configService.get('SHIPROCKET_EMAIL'),
  //       password: this.configService.get('SHIPROCKET_PASSWORD'),
  //     })
  //     .toPromise();

  //   const token = response.data.token;
  //   const expiresAt = new Date();
  //   expiresAt.setDate(expiresAt.getDate() + 10);

  //   await this.prismaService.shipRocketToken.create({
  //     data: {
  //       token,
  //       expiresAt,
  //     },
  //   });

  //   return token;
  // }

  async getCharges(userId: string, cartId: string, data: CalculateShippingDto) {
    try {
      const cart = await this.cartService.findById(cartId);

      const weight = cart?.cartItems?.reduce((acc, product) => {
        return acc + product.product.weight * product.quantity;
      }, 0);

      const subTotal = cart?.cartItems?.reduce((acc, product) => {
        return acc + product.product.discountedPrice * product.quantity;
      }, 0);

      if (!weight) {
        throw new InternalServerErrorException('Cart is empty');
      }

      let weightInKg = weight / 1000;

      const pickupLocations = await this.getAllPickupLocations();

      if (!pickupLocations?.shipping_address?.[0]?.pickup_location) {
        throw new InternalServerErrorException('Pickup location not found');
      }

      const pinCode = parseInt(
        pickupLocations?.shipping_address?.[0]?.pin_code,
      );

      const courierServiceabilityResponseData =
        await this.shiprocketApiService.get<ICourierServiceabilityResponse>(
          'courier/serviceability/',
          {
            params: {
              pickup_postcode: pinCode,
              weight: weightInKg,
              delivery_postcode: data.delivery_postcode,
              cod: data.cod,
            },
          },
        );

      if (
        courierServiceabilityResponseData?.data?.available_courier_companies
          .length <= 0 ||
        !courierServiceabilityResponseData?.data?.available_courier_companies
      ) {
        throw new InternalServerErrorException(
          'No courier companies available for the selected location',
        );
      }

      const shipRocketRecommendedCourierId =
        courierServiceabilityResponseData?.data
          ?.shiprocket_recommended_courier_id;
      const availableCourierCompanies =
        courierServiceabilityResponseData?.data?.available_courier_companies;

      let shippingCourier: ICourierCompany = availableCourierCompanies.find(
        (company) =>
          company.courier_company_id === shipRocketRecommendedCourierId,
      );

      if (!shippingCourier) {
        shippingCourier = availableCourierCompanies[0];
      }

      const totalCharges: any = {
        shippingCost: shippingCourier.freight_charge,
        estimatedDeliveryDate: shippingCourier.etd,
        subTotal: subTotal,
        totalCost:
          subTotal +
          shippingCourier.freight_charge +
          (data.cod ? shippingCourier.cod_charges : 0),
      };

      if (data.cod === 1) {
        totalCharges['codCharges'] = shippingCourier.cod_charges;
      }

      await this.prismaService.cart.update({
        where: { id: cartId },
        data: {
          courierCompanyId: shippingCourier.courier_company_id,
          shippingCost: totalCharges.shippingCost,
          codCharges: data.cod === 1 ? totalCharges.codCharges : null,
          estimatedDeliveryDate: totalCharges.estimatedDeliveryDate,
          subTotal: totalCharges.subTotal,
          totalCost: totalCharges.totalCost,
        },
      });

      return totalCharges;
    } catch (err) {
      console.error(
        'Error calculating shipping charges',
        err?.response?.data ?? err,
      );
      throw new InternalServerErrorException(
        'Error calculating shipping charges',
      );
    }
  }

  async getAllPickupLocations(): Promise<IPickupLocationsResponse['data']> {
    try {
      const data =
        await this.shiprocketApiService.get<IPickupLocationsResponse>(
          'settings/company/pickup',
        );

      return data?.data;
    } catch (err) {
      console.error('Error fetching pickup locations', err);
      throw new InternalServerErrorException('Error fetching pickup locations');
    }
  }

  async createShipRocketOrder(
    dto: CreateShipRocketOrderDto,
  ): Promise<ICreateShipRocketOrderResponse> {
    try {
      return await this.shiprocketApiService.post<ICreateShipRocketOrderResponse>(
        '/orders/create/adhoc',
        dto,
      );
    } catch (err) {
      console.error('Error creating order', err?.response?.data);
      throw new InternalServerErrorException('Error creating order');
    }
  }

  async getShipRocketOrders() {
    try {
      return await this.shiprocketApiService.get<IShipRocketOrdersResponse>(
        '/orders',
      );
    } catch (err) {
      console.error('Error fetching orders', err?.response?.data ?? err);
      throw new InternalServerErrorException('Error fetching orders');
    }
  }

  async generateAWBNumber(dto: GenerateAWBDto) {
    try {
      const data =
        await this.shiprocketApiService.post<IShipRocketGenerateAWBResponse>(
          'courier/assign/awb',
          {
            shipment_id: dto.shipmentId,
            courier_id: dto.courierId,
          },
        );

      console.log('response generateAWBNumber', data);

      const awbNumber = data?.response?.data?.awb_code;

      if (!awbNumber) {
        throw new BadRequestException(
          data?.message ?? 'Failed to generate AWB',
        );
      }

      return {
        awbNumber,
      };
    } catch (error) {
      console.error('Error generating AWB:', error?.response?.data ?? error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to generate AWB');
    }
  }

  async schedulePickup(
    dto: SchedulePickupDto,
  ): Promise<ISchedulePickupResponse> {
    try {
      return await this.shiprocketApiService.post<ISchedulePickupResponse>(
        'courier/generate/pickup',
        {
          shipment_id: dto.shipmentId,
          pickup_date: dto.pickup_date,
          status: dto.status,
        },
      );
    } catch (err) {
      console.error('Error scheduling pickup', err?.response?.data ?? err);
      throw new InternalServerErrorException(
        err?.response?.data ?? 'Error scheduling pickup',
      );
    }
  }

  async cancelOrder(dto: CancelOrderDto) {
    try {
      return await this.shiprocketApiService.post('orders/cancel', {
        ids: dto.ids,
      });
    } catch (err) {
      console.error('Error cancelling order', err);
      throw new InternalServerErrorException('Error cancelling order');
    }
  }

  async validatePincode(pincode: string) {
    try {
      const data =
        await this.shiprocketApiService.get<IPincodeValidationResponse>(
          'open/postcode/details',
          {
            params: {
              postcode: pincode,
            },
          },
        );

      if (data?.success) {
        return {
          isValid: true,
          city: data.postcode_details.city,
          state: data.postcode_details.state,
        };
      } else {
        return {
          isValid: false,
        };
      }
    } catch (err) {
      console.error('Error validating pincode', err);
      throw new InternalServerErrorException('Error validating pincode');
    }
  }
}

import { HttpService } from '@nestjs/axios';
import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cart, CartItem, Product } from '@prisma/client';
import { CartService } from 'src/module/customer/cart/cart.service';
import { PrismaService } from 'src/module/prisma/prisma.service';
import { CalculateShippingDto } from './dto/calculate-shipping.dto';
import { CreateShipRocketOrderDto } from './dto/create-order.dto';
import { GetCouriersDto } from './dto/get-couriers.dto';
import { OrderService } from 'src/module/customer/order/order.service';

@Injectable()
export class ShippingService {
  constructor(
    @Inject(forwardRef(() => CartService))
    private readonly cartService: CartService,
    private readonly orderService: OrderService,
    private readonly httpService: HttpService,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  private async getValidToken(): Promise<string> {
    const tokenEntity = await this.prismaService.shipRocketToken.findFirst({
      where: { expiresAt: { gt: new Date() } },
      orderBy: { expiresAt: 'desc' },
    });

    if (tokenEntity) {
      return tokenEntity.token;
    }

    return this.generateNewToken();
  }

  private async generateNewToken(): Promise<string> {
    const response = await this.httpService
      .post('https://apiv2.shiprocket.in/v1/external/auth/login', {
        email: this.configService.get('SHIPROCKET_EMAIL'),
        password: this.configService.get('SHIPROCKET_PASSWORD'),
      })
      .toPromise();

    const token = response.data.token;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 10);

    await this.prismaService.shipRocketToken.create({
      data: {
        token,
        expiresAt,
      },
    });

    return token;
  }

  async getCharges(userId: string, data: CalculateShippingDto) {
    try {
      const token = await this.getValidToken();

      const cart = await this.cartService.findByUserId(userId);

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

      console.log('pickup pinCode', pinCode);

      const response = await this.httpService
        .get(
          'https://apiv2.shiprocket.in/v1/external/courier/serviceability/',
          {
            params: {
              pickup_postcode: pinCode,
              weight: weightInKg,
              delivery_postcode: data.delivery_postcode,
              cod: data.cod,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .toPromise();

      if (
        response?.data?.data?.available_courier_companies.length <= 0 ||
        !response?.data?.data?.available_courier_companies
      ) {
        throw new InternalServerErrorException(
          'No courier companies available for the selected location',
        );
      }

      const shipRocketRecommendedCourierId =
        response.data.data.shiprocket_recommended_courier_id;
      const availableCourierCompanies =
        response.data.data.available_courier_companies;

      let shippingCourier = availableCourierCompanies.find(
        (company) =>
          company.courier_company_id === shipRocketRecommendedCourierId,
      );

      if (!shippingCourier) {
        shippingCourier = availableCourierCompanies[0];
      }

      const totalCharges = {
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

  async getAvailableCouriers(dto: GetCouriersDto) {
    try {
      const token = await this.getValidToken();

      const response = await this.httpService
        .get(
          'https://apiv2.shiprocket.in/v1/external/courier/serviceability/',
          {
            params: {
              pickup_postcode: dto.pickup_pincode,
              weight: dto.weight,
              delivery_postcode: dto.delivery_pincode,
              cod: dto.cod,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .toPromise();

      return response.data;
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

  async getAllPickupLocations(): Promise<any> {
    try {
      const token = await this.getValidToken();

      const response = await this.httpService
        .get(
          'https://apiv2.shiprocket.in/v1/external/settings/company/pickup',
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        )
        .toPromise();

      return response.data.data;
    } catch (err) {
      console.error('Error fetching pickup locations', err);
      throw new InternalServerErrorException('Error fetching pickup locations');
    }
  }

  async createShipRocketOrder(dto: CreateShipRocketOrderDto) {
    try {
      const token = await this.getValidToken();

      const response = await this.httpService
        .post(
          'https://apiv2.shiprocket.in/v1/external/orders/create/adhoc',
          dto,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        )
        .toPromise();

      return response.data;
    } catch (err) {
      console.error('Error creating order', err?.response?.data);
      throw new InternalServerErrorException('Error creating order');
    }
  }

  async validatePincode(pincode: string) {
    try {
      const token = await this.getValidToken();
      const response = await this.httpService
        .get(`https://apiv2.shiprocket.in/v1/external/open/postcode/details`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            postcode: pincode,
          },
        })
        .toPromise();
      console.log('response', response.data);

      if (response.data.success) {
        return {
          isValid: true,
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

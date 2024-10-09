import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { CreateShipRocketOrderDto } from './dto/create-order.dto';
import { PrismaService } from 'src/module/prisma/prisma.service';
import { CalculateShippingDto } from './dto/calculate-shipping.dto';
import { CartService } from 'src/module/customer/cart/cart.service';

@Injectable()
export class ShippingService {
  constructor(
    private readonly httpService: HttpService,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly cartService: CartService,
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

      const pickupLocations = await this.getAllPickupLocations();

      if (!pickupLocations?.shipping_address?.[0]?.pickup_location) {
        throw new InternalServerErrorException('Pickup location not found');
      }

      const pinCode = parseInt(
        pickupLocations?.shipping_address?.[0]?.pin_code,
      );

      console.log('weightt', weight);
      console.log('pinCodeee', pinCode);

      const response = await this.httpService
        .get(
          'https://apiv2.shiprocket.in/v1/external/courier/serviceability/',
          {
            params: {
              pickup_postcode: pinCode,
              weight: weight,
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

      console.log('response', response.data.data);

      const shipRocketRecommendedCourierId =
        response.data.data.shiprocket_recommended_courier_id;
      const availableCourierCompanies =
        response.data.data.available_courier_companies;

      console.log('availableCourierCompanies', availableCourierCompanies);

      const shippingCourier = availableCourierCompanies.find(
        (company) =>
          company.courier_company_id === shipRocketRecommendedCourierId,
      );

      console.log('shippingCourier', shippingCourier);

      const totalCharges = {
        shippingCost: shippingCourier.rate,
        estimatedDeliveryDate: shippingCourier.etd,
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

  async createShipRocketOrder(orderData: CreateShipRocketOrderDto) {
    const token = await this.getValidToken();

    const locations = await this.getAllPickupLocations();

    const shipRocketOrderData: any = {
      order_id: orderData.order_id,
      order_date: orderData.order_date,
      pickup_location:
        locations?.shipping_address &&
        locations?.shipping_address[0]?.pickup_location,
      channel_id: orderData.channel_id,
      comment: orderData.comment,
      billing_customer_name: orderData.billing_customer_name,
      billing_last_name: orderData.billing_last_name,
      billing_address: orderData.billing_address,
      billing_address_2: orderData.billing_address_2,
      billing_city: orderData.billing_city,
      billing_pincode: orderData.billing_pincode,
      billing_state: orderData.billing_state,
      billing_country: orderData.billing_country,
      billing_email: orderData.billing_email,
      billing_phone: orderData.billing_phone,
      shipping_is_billing: orderData.shipping_is_billing,
      order_items: orderData.order_items,
      payment_method: orderData.payment_method,
      shipping_charges: orderData.shipping_charges,
      giftwrap_charges: orderData.giftwrap_charges,
      transaction_charges: orderData.transaction_charges,
      total_discount: orderData.total_discount,
      sub_total: orderData.sub_total,
      length: orderData.length,
      breadth: orderData.breadth,
      height: orderData.height,
      weight: orderData.weight,
    };

    if (orderData.shipping_is_billing === false) {
      shipRocketOrderData.shipping_customer_name =
        orderData.shipping_customer_name;
      shipRocketOrderData.shipping_last_name = orderData.shipping_last_name;
      shipRocketOrderData.shipping_address = orderData.shipping_address;
      shipRocketOrderData.shipping_address_2 = orderData.shipping_address_2;
      shipRocketOrderData.shipping_city = orderData.shipping_city;
      shipRocketOrderData.shipping_pincode = orderData.shipping_pincode;
      shipRocketOrderData.shipping_country = orderData.shipping_country;
      shipRocketOrderData.shipping_state = orderData.shipping_state;
      shipRocketOrderData.shipping_email = orderData.shipping_email;
      shipRocketOrderData.shipping_phone = orderData.shipping_phone;
    }

    console.log('token', token);
    console.log('shipRocketOrderData', shipRocketOrderData);

    try {
      const response = await this.httpService
        .post(
          'https://apiv2.shiprocket.in/v1/external/orders/create/adhoc',
          shipRocketOrderData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        )
        .toPromise();

      console.log('responseee', response);

      return response.data;
    } catch (err) {
      console.error('Error creating order', err?.response?.data);
      throw new InternalServerErrorException('Error creating order');
    }
  }
}

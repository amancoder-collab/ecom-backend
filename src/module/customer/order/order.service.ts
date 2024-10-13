import { Injectable } from '@nestjs/common';
import { InjectRazorpay } from 'nestjs-razorpay';
import Razorpay from 'razorpay';
import { CreateOrderDto } from './dto/create-order.dto';
import { ShippingService } from 'src/shipping/shipping.service';
import { CartService } from '../cart/cart.service';
import { PrismaService } from 'src/module/prisma/prisma.service';
import { Cart, CartItem, Product } from '@prisma/client';
import { CreateShipRocketOrderDto } from 'src/shipping/dto/create-order.dto';

@Injectable()
export class OrderService {
  public constructor(
    private readonly cartService: CartService,
    private readonly shippingService: ShippingService,
    private readonly prismaService: PrismaService,
  ) {} // @InjectRazorpay() private readonly razorpayClient: Razorpay,

  private async generateUniqueOrderId(): Promise<string> {
    const timestamp = Date.now().toString();
    const randomNum = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
    const orderId = `${timestamp}${randomNum}`;

    const existingOrder = await this.prismaService.order.findUnique({
      where: { orderId: orderId },
    });

    if (existingOrder) {
      return this.generateUniqueOrderId();
    }

    return orderId;
  }

  private calculateLargestItemDimensions(
    cart: Cart & { cartItems: CartItem[] },
  ) {
    let largest = { length: 0, breadth: 0, height: 0 };
    let totalWeight = 0;

    cart?.cartItems.forEach((item: CartItem & { product: Product }) => {
      const product = item.product;
      largest.length = Math.max(largest.length, product?.length ?? 0);
      largest.breadth = Math.max(largest.breadth, product?.breadth ?? 0);
      largest.height = Math.max(largest.height, product?.height ?? 0);
      totalWeight += (product?.weight ?? 0) * item.quantity;
    });

    return { ...largest, weight: totalWeight };
  }

  async createOrder(userId: string, dto: CreateOrderDto) {
    const locations = await this.shippingService.getAllPickupLocations();

    const cart = await this.cartService.findByUserId(userId);

    const dimensions = this.calculateLargestItemDimensions(cart);

    const shipRocketOrderData: CreateShipRocketOrderDto = {
      order_id: await this.generateUniqueOrderId(),
      order_date: new Date().toISOString(),
      pickup_location:
        locations?.shipping_address &&
        locations?.shipping_address[0]?.pickup_location,
      billing_customer_name: cart?.billingAddress?.firstName,
      billing_last_name: cart?.billingAddress?.lastName,
      billing_address: cart?.billingAddress?.address,
      billing_address_2: cart?.billingAddress?.address2,
      billing_city: cart?.billingAddress?.city,
      billing_pincode: cart?.billingAddress?.pincode,
      billing_state: cart?.billingAddress?.state,
      billing_country: cart?.billingAddress?.country,
      billing_email: cart?.billingAddress?.email,
      billing_phone: cart?.billingAddress?.phone,
      shipping_is_billing: cart?.shippingAddressId === cart?.billingAddressId,
      order_items: cart?.cartItems.map((item) => ({
        name: item.product.name,
        sku: item.product.sku,
        units: item.quantity,
        selling_price: item.product.discountedPrice,
      })),
      payment_method: dto.payment_method,
      total_discount: 0,
      sub_total: cart?.cartItems?.reduce((acc, product) => {
        return acc + product.product.discountedPrice * product.quantity;
      }, 0),
      length: dimensions.length,
      breadth: dimensions.breadth,
      weight: dimensions.weight,
      height: dimensions.height,
    };

    if (cart?.shippingAddressId !== cart?.billingAddressId) {
      shipRocketOrderData.shipping_customer_name =
        cart?.shippingAddress?.firstName;
      shipRocketOrderData.shipping_last_name = cart?.shippingAddress?.lastName;
      shipRocketOrderData.shipping_address = cart?.shippingAddress?.address;
      shipRocketOrderData.shipping_address_2 = cart?.shippingAddress?.address2;
      shipRocketOrderData.shipping_city = cart?.shippingAddress?.city;
      shipRocketOrderData.shipping_pincode = cart?.shippingAddress?.pincode;
      shipRocketOrderData.shipping_country = cart?.shippingAddress?.country;
      shipRocketOrderData.shipping_state = cart?.shippingAddress?.state;
      shipRocketOrderData.shipping_email = cart?.shippingAddress?.email;
      shipRocketOrderData.shipping_phone = cart?.shippingAddress?.phone;
    }

    const order = await this.prismaService.order.create({
      data: {
        orderId: shipRocketOrderData.order_id,
        userId: ,
        orderDate: new Date(),
        estimatedDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          .toISOString(),
      },
    });

    // return await this.razorpayClient.orders.create(options);
  }
}

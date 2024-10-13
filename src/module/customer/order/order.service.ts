import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Cart, CartItem, Product } from '@prisma/client';
import { PrismaService } from 'src/module/prisma/prisma.service';
import { CreateShipRocketOrderDto } from 'src/shipping/dto/create-order.dto';
import { ShippingService } from 'src/shipping/shipping.service';
import { CartService } from '../cart/cart.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  public constructor(
    @Inject(forwardRef(() => CartService))
    @Inject(forwardRef(() => ShippingService))
    private readonly cartService: CartService,
    private readonly shippingService: ShippingService,
    private readonly prismaService: PrismaService,
  ) {}

  private async generateUniqueOrderId(): Promise<string> {
    const timestamp = Date.now().toString();
    const randomNum = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
    const orderId = `${timestamp}${randomNum}`;

    const existingOrder = await this.prismaService.order.findUnique({
      where: { shipRocketOrderId: orderId },
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

  async findOrderByShipRocketOrderId(shipRocketOrderId: string) {
    return this.prismaService.order.findUnique({
      where: { shipRocketOrderId },
      include: {
        orderItems: true,
        user: true,
        payment: true,
      },
    });
  }

  async findOrderById(id: string) {
    return this.prismaService.order.findUnique({
      where: { id },
      include: {
        orderItems: true,
        user: true,
        payment: true,
      },
    });
  }

  async findOrdersByUserId(userId: string) {
    return this.prismaService.order.findMany({
      where: { userId },
      include: {
        orderItems: true,
        user: true,
        payment: true,
      },
    });
  }

  async createOrder(userId: string) {
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
      payment_method: 'COD',
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

    const shipRocketOrder =
      await this.shippingService.createShipRocketOrder(shipRocketOrderData);

    const order = await this.prismaService.order.create({
      data: {
        shipRocketOrderId: shipRocketOrder.order_id,
        channelOrderId: shipRocketOrder.channel_order_id,
        shipmentId: shipRocketOrder.shipment_id,
        customOrderId: shipRocketOrderData.order_id,
        orderDate: shipRocketOrderData.order_date,
        estimatedDeliveryDate: cart?.estimatedDeliveryDate,
        shippingCost: cart?.shippingCost,
        codCharges: cart?.codCharges ?? 0,
        subTotal: cart?.subTotal,
        totalCost: cart?.totalCost,
        user: {
          connect: {
            id: userId,
          },
        },
        billingAddress: {
          connect: {
            id: cart?.billingAddressId,
          },
        },
        shippingAddress: {
          connect: {
            id: cart?.shippingAddressId,
          },
        },
        orderItems: {
          createMany: {
            data: cart?.cartItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              size: item.size,
              color: item.color,
            })),
          },
        },
      },
      include: {
        billingAddress: true,
        shippingAddress: true,
        orderItems: true,
        user: true,
        payment: true,
      },
    });

    console.log('ship rocket order', shipRocketOrder);
    return order;
  }
}

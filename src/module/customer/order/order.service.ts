import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { PrismaService } from "src/module/prisma/prisma.service";
import { OrderProducer } from "src/rabbitmq/producers/order.producer";
import { CartService } from "../cart/cart.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);
  public constructor(
    @Inject(forwardRef(() => CartService))
    private readonly cartService: CartService,
    private readonly prismaService: PrismaService,
    private readonly orderProducer: OrderProducer,
  ) {}

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

  async updateOrder(orderId: string, data: UpdateOrderDto) {
    return this.prismaService.order.update({
      where: { id: orderId },
      data: {
        shipRocketOrderId: data.shipRocketOrderId,
        shipmentId: data.shipmentId,
        awbCode: data.awbCode,
        customOrderId: data.customOrderId,
        actualDeliveryDate: data.actualDeliveryDate,
        estimatedDeliveryDate: data.estimatedDeliveryDate,
        codCharges: data.codCharges,
        shippingCost: data.shippingCost,
        subTotal: data.subTotal,
        totalCost: data.totalCost,
        courierCompanyId: data.courierCompanyId,
        orderDate: data.orderDate,
        paymentId: data.paymentId,
        billingAddressId: data.billingAddressId,
        shippingAddressId: data.shippingAddressId,
      },
    });
  }

  async createOrder(userId: string, dto: CreateOrderDto) {
    try {
      const cart = await this.cartService.findByUserId(userId);

      const order = await this.prismaService.order.create({
        data: {
          courierCompanyId: cart?.courierCompanyId,
          orderDate: new Date(),
          estimatedDeliveryDate: cart?.estimatedDeliveryDate,
          shippingCost: cart?.shippingCost,
          codCharges: cart?.codCharges ?? 0,
          subTotal: cart?.subTotal,
          totalCost: cart?.totalCost,
          user: { connect: { id: userId } },
          billingAddress: {
            create: {
              firstName: cart?.billingAddress.firstName,
              lastName: cart?.billingAddress.lastName,
              email: cart?.billingAddress.email,
              phone: cart?.billingAddress.phone,
              address: cart?.billingAddress.address,
              address2: cart?.billingAddress.address2,
              city: cart?.billingAddress.city,
              state: cart?.billingAddress.state,
              country: cart?.billingAddress.country,
              pincode: cart?.billingAddress.pincode,
              user: { connect: { id: userId } },
            },
          },
          shippingAddress: {
            create: {
              firstName: cart?.billingAddress.firstName,
              lastName: cart?.billingAddress.lastName,
              email: cart?.billingAddress.email,
              phone: cart?.billingAddress.phone,
              address: cart?.billingAddress.address,
              address2: cart?.billingAddress.address2,
              city: cart?.billingAddress.city,
              state: cart?.billingAddress.state,
              country: cart?.billingAddress.country,
              pincode: cart?.billingAddress.pincode,
              user: { connect: { id: userId } },
            },
          },
          orderItems: {
            createMany: {
              data: cart?.cartItems.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                name: item.product.name,
                thumbnail: item.variant
                  ? item.variant.thumbnail
                  : item.product.thumbnail,
                sku: item.variant ? item.variant.sku : item.product.sku,
                weight: item.variant
                  ? item.variant.weight
                  : item.product.weight,
                width: item.variant ? item.variant.width : item.product.width,
                height: item.variant
                  ? item.variant.height
                  : item.product.height,
                length: item.variant
                  ? item.variant.length
                  : item.product.length,
                price: item.variant ? item.variant.price : item.product.price,
                discountedPrice: item.variant
                  ? item.variant.discountedPrice
                  : item.product.discountedPrice,
                images: item.variant
                  ? item.variant.images
                  : item.product.images,
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

      // await this.orderProducer.publishOrderCreated(order.id, userId);

      return order;
    } catch (error: any) {
      this.logger.error(
        `Failed to create order: ${error?.response?.data ?? error.message}`,
      );
      throw new InternalServerErrorException(
        `Failed to create order: ${error?.response?.data ?? error.message}`,
      );
    }
  }
}

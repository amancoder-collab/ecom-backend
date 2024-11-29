import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CartService } from "src/module/customer/cart/cart.service";
import { PrismaService } from "src/module/prisma/prisma.service";
import { CalculateShippingDto } from "./dto/calculate-shipping.dto";
import { CreateShipRocketOrderDto } from "./dto/create-order.dto";
import { GenerateAWBDto } from "./dto/generate-awb.dto";
import {
  ICourierCompany,
  ICreateShipRocketOrderResponse,
} from "./interface/shiprocket-responses";
import { ShipRocketApiService } from "./shiprocket-api.service";
import {
  Address,
  Cart,
  CartItem,
  Order,
  OrderItem,
  Product,
  ProductVariant,
} from "@prisma/client";
import { OrderService } from "src/module/customer/order/order.service";

@Injectable()
export class ShippingService {
  private readonly logger = new Logger(ShippingService.name);
  constructor(
    @Inject(forwardRef(() => CartService))
    private readonly cartService: CartService,
    @Inject(forwardRef(() => OrderService))
    private readonly orderService: OrderService,
    private readonly prismaService: PrismaService,
    private readonly shiprocketApiService: ShipRocketApiService,
  ) {}

  private async generateUniqueOrderId(): Promise<string> {
    const timestamp = Date.now().toString();
    const randomNum = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
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
    order: Order & {
      orderItems: (OrderItem & {
        variant: ProductVariant;
        product: Product;
      })[];
    },
  ) {
    let largest = { length: 0, width: 0, height: 0 };
    let totalWeight = 0;

    order?.orderItems.forEach((item) => {
      const product = item.variant ?? item.product;
      largest.length = Math.max(largest.length, product?.length ?? 0);
      largest.width = Math.max(largest.width, product?.width ?? 0);
      largest.height = Math.max(largest.height, product?.height ?? 0);
      totalWeight += (product?.weight ?? 0) * item.quantity;
    });

    return { ...largest, weight: totalWeight };
  }

  async getAllPickupLocations() {
    return await this.shiprocketApiService.getAllPickupLocations();
  }

  async createOrder(orderId: string, userId: string) {
    throw new Error("Some error in order creation");
    const locations = await this.shiprocketApiService.getAllPickupLocations();
    const order = await this.orderService.findOrderById(orderId);

    const shipRocketOrderData = await this.prepareShipRocketOrderData(
      order,
      locations,
    );

    const shipRocketOrder =
      await this.createShipRocketOrder(shipRocketOrderData);

    const awbNumber = await this.generateAWBNumber({
      shipmentId: shipRocketOrder.shipment_id,
      courierId: order?.courierCompanyId,
    });

    await this.shiprocketApiService.schedulePickup({
      shipmentId: shipRocketOrder.shipment_id,
    });

    await this.orderService.updateOrder(orderId, {
      awbCode: awbNumber,
      shipRocketOrderId: shipRocketOrder.order_id,
      shipmentId: shipRocketOrder.shipment_id,
    });
  }

  private async prepareShipRocketOrderData(
    order: Order & {
      orderItems: (OrderItem & { product: Product; variant: ProductVariant })[];
      billingAddress: Address;
      shippingAddress: Address;
    },
    locations: any,
  ): Promise<CreateShipRocketOrderDto> {
    const dimensions = this.calculateLargestItemDimensions(order);

    const shipRocketOrderData: CreateShipRocketOrderDto = {
      order_id: await this.generateUniqueOrderId(),
      order_date: new Date().toISOString(),
      pickup_location:
        locations?.shipping_address &&
        locations?.shipping_address[0]?.pickup_location,
      billing_customer_name: order?.billingAddress?.firstName,
      billing_last_name: order?.billingAddress?.lastName,
      billing_address: order?.billingAddress?.address,
      billing_address_2: order?.billingAddress?.address2,
      billing_city: order?.billingAddress?.city,
      billing_pincode: order?.billingAddress?.pincode,
      billing_state: order?.billingAddress?.state,
      billing_country: order?.billingAddress?.country,
      billing_email: order?.billingAddress?.email,
      billing_phone: order?.billingAddress?.phone,
      shipping_is_billing: order?.shippingAddressId === order?.billingAddressId,
      order_items: order?.orderItems.map((item) => ({
        name: item.product.name,
        sku: item.variant ? item.variant.sku : item.product.sku,
        units: item.quantity,
        selling_price: item.variant
          ? (item.variant.discountedPrice ?? item.variant.price)
          : (item.product.discountedPrice ?? item.product.price),
      })),
      payment_method: "COD",
      total_discount: 0,
      sub_total: order?.orderItems?.reduce((acc, item) => {
        return acc + item.product.discountedPrice * item.quantity;
      }, 0),
      length: dimensions.length,
      breadth: dimensions.width,
      weight: dimensions.weight,
      height: dimensions.height,
    };

    if (order?.shippingAddressId !== order?.billingAddressId) {
      shipRocketOrderData.shipping_customer_name =
        order?.shippingAddress?.firstName;
      shipRocketOrderData.shipping_last_name = order?.shippingAddress?.lastName;
      shipRocketOrderData.shipping_address = order?.shippingAddress?.address;
      shipRocketOrderData.shipping_address_2 = order?.shippingAddress?.address2;
      shipRocketOrderData.shipping_city = order?.shippingAddress?.city;
      shipRocketOrderData.shipping_pincode = order?.shippingAddress?.pincode;
      shipRocketOrderData.shipping_country = order?.shippingAddress?.country;
      shipRocketOrderData.shipping_state = order?.shippingAddress?.state;
      shipRocketOrderData.shipping_email = order?.shippingAddress?.email;
      shipRocketOrderData.shipping_phone = order?.shippingAddress?.phone;
    }

    return shipRocketOrderData;
  }

  async getCharges(cartId: string, data: CalculateShippingDto) {
    try {
      const cart = await this.cartService.findById(cartId);

      const weight = cart?.cartItems?.reduce((acc, item) => {
        return (
          acc +
          (item.product.hasVariants
            ? item.variant.weight
            : item.product.weight) *
            item.quantity
        );
      }, 0);

      if (!weight) {
        throw new InternalServerErrorException("Cart is empty");
      }

      const subTotal = cart?.cartItems?.reduce((acc, item) => {
        return (
          acc +
          (item.product.hasVariants
            ? (item.variant.discountedPrice ?? item.variant.price)
            : (item.product.discountedPrice ?? item.product.price)) *
            item.quantity
        );
      }, 0);

      if (data?.delivery_postcode) {
        let weightInKg = weight / 1000;
        const pickupLocations =
          await this.shiprocketApiService.getAllPickupLocations();

        if (!pickupLocations?.shipping_address?.[0]?.pickup_location) {
          throw new InternalServerErrorException("Pickup location not found");
        }

        const pinCode = parseInt(
          pickupLocations?.shipping_address?.[0]?.pin_code,
        );

        const courierServiceabilityResponseData =
          await this.shiprocketApiService.getCourierServiceability({
            pickup_postcode: pinCode,
            weight: weightInKg,
            delivery_postcode: data.delivery_postcode,
            cod: data.cod,
          });

        if (
          courierServiceabilityResponseData?.data?.available_courier_companies
            .length <= 0 ||
          !courierServiceabilityResponseData?.data?.available_courier_companies
        ) {
          throw new InternalServerErrorException(
            "No courier companies available for the selected location",
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

        console.log("ShippingCourier for cart", cart.id, shippingCourier);
        this.logger.log("ShippingCourier for cart", cart.id, shippingCourier);

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
          totalCharges["codCharges"] = shippingCourier.cod_charges;
        }

        return await this.prismaService.cart.update({
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
      } else {
        return await this.prismaService.cart.update({
          where: { id: cartId },
          data: {
            courierCompanyId: null,
            shippingCost: 0,
            codCharges: 0,
            estimatedDeliveryDate: null,
            subTotal: subTotal,
            totalCost: subTotal,
          },
          include: {
            shippingAddress: true,
            billingAddress: true,
            cartItems: {
              include: {
                product: true,
                variant: true,
              },
            },
          },
        });
      }
    } catch (err: any) {
      this.logger.error(
        "Error calculating shipping charges",
        err?.response?.data ?? err,
      );
      throw new InternalServerErrorException(
        "Error calculating shipping charges",
      );
    }
  }

  async createShipRocketOrder(
    dto: CreateShipRocketOrderDto,
  ): Promise<ICreateShipRocketOrderResponse> {
    try {
      return await this.shiprocketApiService.createOrder(dto);
    } catch (err: any) {
      this.logger.error("Error creating order", err?.response?.data);
      throw new InternalServerErrorException("Error creating order");
    }
  }

  async getShipRocketOrders() {
    try {
      return await this.shiprocketApiService.getOrders();
    } catch (err: any) {
      this.logger.error("Error fetching orders", err?.response?.data ?? err);
      throw new InternalServerErrorException("Error fetching orders");
    }
  }

  async generateAWBNumber(dto: GenerateAWBDto) {
    try {
      const data = await this.shiprocketApiService.generateAWBNumber(dto);

      this.logger.log("response generateAWBNumber", data);

      const awbNumber = data?.awb_code;

      if (!awbNumber) {
        throw new BadRequestException("Failed to generate AWB");
      }

      return awbNumber;
    } catch (error: any) {
      this.logger.error(
        "Error generating AWB:",
        error?.response?.data ?? error,
      );
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException("Failed to generate AWB");
    }
  }

  async validatePincode(pincode: string) {
    try {
      const data = await this.shiprocketApiService.getPostCodeDetails(pincode);

      this.logger.log("dataaa", data);

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
      this.logger.error("Error validating pincode", err);
      throw new InternalServerErrorException("Error validating pincode");
    }
  }
}

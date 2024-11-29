import { Injectable, Logger } from "@nestjs/common";
import { ShippingService } from "../../shipping/shipping.service";
import { QUEUE_NAMES } from "../constants/queues.constant";
import { RabbitMQService } from "../rabbitmq.service";

@Injectable()
export class ShippingConsumer {
  private readonly logger = new Logger(ShippingConsumer.name);

  constructor(
    private readonly rabbitMQService: RabbitMQService,
    private readonly shippingService: ShippingService,
  ) {}

  async onModuleInit() {
    this.logger.log("ShippingConsumer initialized");
    await this.setupConsumers();
  }

  private async setupConsumers() {
    await this.rabbitMQService.consumeMessages(
      QUEUE_NAMES.SHIPPING_FAILED,
      async (message, channel, msg) => {
        try {
          this.logger.log("Shipping failed for order", {
            orderId: message.orderId,
            userId: message.userId,
            error: message.error,
            retryCount: message.retryCount,
          });
        } catch (error: any) {
          this.logger.error("Failed to process order", {
            orderId: message.orderId,
            error: error.message,
          });
        }
      },
    );

    await this.rabbitMQService.consumeMessages(
      QUEUE_NAMES.ORDER_CREATED,
      async (message, channel, msg) => {
        try {
          this.logger.log(`Processing shipping for order: ${message.orderId}`);

          await this.shippingService.createOrder(
            message.orderId,
            message.userId,
          );
        } catch (error: any) {
          this.logger.error("Error in order creation", {
            orderId: message.orderId,
            error: error.message,
          });

          const retryCount = (msg.properties.headers?.retryCount ||
            0) as number;
          const MAX_RETRIES = 3;

          if (retryCount < MAX_RETRIES) {
            const updatedHeaders = {
              ...msg.properties.headers,
              retryCount: retryCount + 1,
            };

            await this.rabbitMQService.publishMessage(
              QUEUE_NAMES.ORDER_CREATED_RETRY,
              message,
              {
                headers: updatedHeaders,
                expiration: String(Math.pow(2, retryCount) * 1000),
              },
            );
          } else {
            await this.rabbitMQService.publishMessage(
              QUEUE_NAMES.SHIPPING_FAILED,
              {
                orderId: message.orderId,
                userId: message.userId,
                error: error,
                retryCount,
                timestamp: new Date().toISOString(),
              },
            );
          }
        }
      },
    );
  }
}

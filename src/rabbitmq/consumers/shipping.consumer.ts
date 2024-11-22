import { Injectable, Logger } from '@nestjs/common';
import { RabbitMQService } from '../rabbitmq.service';
import { ShippingService } from '../../shipping/shipping.service';
import { QUEUE_NAMES } from '../constants/queues.constant';

@Injectable()
export class ShippingConsumer {
  private readonly logger = new Logger(ShippingConsumer.name);

  constructor(
    private readonly rabbitMQService: RabbitMQService,
    private readonly shippingService: ShippingService,
  ) {}

  async onModuleInit() {
    this.logger.log('ShippingConsumer initialized');
    await this.setupConsumers();
  }

  private async setupConsumers() {
    await this.rabbitMQService.consumeMessages(
      QUEUE_NAMES.ORDER_CREATED,
      async message => {
        try {
          this.logger.log(`Processing shipping for order: ${message.orderId}`);

          // Reference to existing shipping creation code
          await this.shippingService.createOrder(
            message.orderId,
            message.userId,
          );
        } catch (error: any) {
          this.logger.error('Failed to process shipping', {
            error: error.message,
            orderId: message.orderId,
          });

          // Publish to failed queue
          await this.rabbitMQService.publishMessage(
            QUEUE_NAMES.SHIPPING_FAILED,
            {
              orderId: message.orderId,
              error: error.message,
              timestamp: new Date().toISOString(),
            },
          );
        }
      },
    );
  }
}

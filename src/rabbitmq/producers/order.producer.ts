import { Injectable } from "@nestjs/common";
import { RabbitMQService } from "../rabbitmq.service";
import { QUEUE_NAMES } from "../constants/queues.constant";

@Injectable()
export class OrderProducer {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  // async publishOrderCreated(orderId: string, userId: string) {
  //   await this.rabbitMQService.publishMessage(QUEUE_NAMES.ORDER_CREATED, {
  //     orderId,
  //     userId,
  //     timestamp: new Date().toISOString(),
  //   });
  // }

  // async publishOrderCancelled(orderId: string) {
  //   await this.rabbitMQService.publishMessage(QUEUE_NAMES.ORDER_CANCELLED, {
  //     orderId,
  //     timestamp: new Date().toISOString(),
  //   });
  // }
}

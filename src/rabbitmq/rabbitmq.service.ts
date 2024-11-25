import { Injectable, OnModuleInit, Logger } from "@nestjs/common";
import * as amqp from "amqplib";
import { AppConfigService } from "src/lib/config/config.service";
import { QUEUE_NAMES } from "./constants/queues.constant";

@Injectable()
export class RabbitMQService implements OnModuleInit {
  private connection: amqp.Connection;
  private channel: amqp.Channel;
  private logger = new Logger(RabbitMQService.name);
  private initialized = false;

  constructor(private configService: AppConfigService) {}

  async onModuleInit() {
    await this.initialize();
  }

  private async initialize() {
    if (this.initialized) return;

    try {
      this.logger.log("Connecting to RabbitMQ");
      this.connection = await amqp.connect(this.configService.rabbitMQUrl);
      this.channel = await this.connection.createChannel();

      // Declare all queues from constants
      for (const queueName of Object.values(QUEUE_NAMES)) {
        await this.channel.assertQueue(queueName, { durable: true });
        this.logger.log(`Queue ${queueName} initialized`);
      }

      this.initialized = true;
      this.logger.log("RabbitMQ initialization completed");
    } catch (error) {
      this.logger.error("RabbitMQ connection failed:", error);
      throw error;
    }
  }

  async publishMessage(queue: string, message: any) {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
        persistent: true,
      });
    } catch (error) {
      console.error("Error publishing message:", error);
      throw error;
    }
  }

  async consumeMessages(
    queue: string,
    callback: (message: any) => Promise<void>,
  ) {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      await this.channel.consume(queue, async (message) => {
        if (message) {
          const content = JSON.parse(message.content.toString());
          await callback(content);
          this.channel.ack(message);
        }
      });
    } catch (error) {
      console.error("Error consuming messages:", error);
      throw error;
    }
  }
}

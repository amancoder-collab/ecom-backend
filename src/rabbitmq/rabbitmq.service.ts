import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
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

      for (const queueName of Object.values(QUEUE_NAMES)) {
        await this.channel.deleteQueue(queueName).catch(() => {});
        this.logger.log(`Queue ${queueName} deleted`);
      }

      await this.channel.assertExchange("dlx.exchange", "direct", {
        durable: true,
      });

      const queueConfigs = {
        [QUEUE_NAMES.ORDER_CANCELLED]: {
          durable: true,
        },
        [QUEUE_NAMES.ORDER_CREATED]: {
          durable: true,
        },
        [QUEUE_NAMES.ORDER_CREATED_RETRY]: {
          durable: true,
          arguments: {
            "x-dead-letter-exchange": "dlx.exchange",
            "x-dead-letter-routing-key": QUEUE_NAMES.ORDER_CREATED,
            "x-message-ttl": 5000,
          },
        },
        [QUEUE_NAMES.SHIPPING_UPDATED]: {
          durable: true,
        },
        [QUEUE_NAMES.SHIPPING_CREATED]: {
          durable: true,
        },
        [QUEUE_NAMES.SHIPPING_FAILED]: {
          durable: true,
        },
      };

      for (const [queueName, config] of Object.entries(queueConfigs)) {
        await this.channel.assertQueue(queueName, config);
        this.logger.log(`Queue ${queueName} initialized`);
      }

      await this.channel.bindQueue(
        QUEUE_NAMES.ORDER_CREATED,
        "dlx.exchange",
        QUEUE_NAMES.ORDER_CREATED,
      );

      this.initialized = true;
      this.logger.log("RabbitMQ initialization completed");
    } catch (error) {
      this.logger.error("RabbitMQ connection failed:", error);
      throw error;
    }
  }

  async publishMessage(
    queue: string,
    message: any,
    options?: amqp.Options.Publish,
  ) {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
        persistent: true,
        ...options,
      });
    } catch (error) {
      console.error("Error publishing message:", error);
      throw error;
    }
  }

  async consumeMessages(
    queue: string,
    callback: (
      message: any,
      channel: amqp.Channel,
      msg: amqp.Message,
    ) => Promise<void>,
    options?: { noAck: boolean },
  ) {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      await this.channel.consume(queue, async (message) => {
        if (message) {
          const content = JSON.parse(message.content.toString());
          await callback(content, this.channel, message);
          if (!options?.noAck) {
            this.channel.ack(message);
          }
        }
      });
    } catch (error) {
      console.error("Error consuming messages:", error);
      throw error;
    }
  }
}

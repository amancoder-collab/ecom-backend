import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CustomLoggerService } from '../logger/logger.service';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly logger: CustomLoggerService) {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'warn' },
        { emit: 'event', level: 'error' },
      ],
    });
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log(
      'Prisma connection established successfully',
      'PrismaService',
    );
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Prisma connection closed gracefully', 'PrismaService');
  }
}

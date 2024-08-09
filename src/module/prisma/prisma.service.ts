import {
    Injectable,
    OnModuleInit,
    OnModuleDestroy,
    Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
// import { prismaMiddleware } from 'provider/middlewere/prisma.middleware';

@Injectable()
export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy
{
    private readonly logger = new Logger(PrismaService.name);
    // constructor() {   // middle were implemented for the is_deleted
    //     super();
    //     this.$use(prismaMiddleware());
    // }
    async onModuleInit() {
        await this.$connect();
        this.logger.log('Prisma connection established successfully');
    }

    async onModuleDestroy() {
        await this.$disconnect();
        this.logger.log('Prisma connection closed gracefully');
    }
}

import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Operation } from 'src/common/operations/operation.function';

@Module({
    controllers: [ProductsController],
    providers: [ProductsService, Operation],
})
export class ProductsModule {}

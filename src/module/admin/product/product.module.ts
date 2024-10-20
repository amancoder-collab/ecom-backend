import { Module } from '@nestjs/common';
import { Operation } from 'src/common/operations/operation.function';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService, Operation],
})
export class ProductModule {}

import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Operation } from 'src/common/operations/operation.function';

@Module({
  controllers: [ProductController],
  providers: [ProductService, Operation],
})
export class ProductModule {}

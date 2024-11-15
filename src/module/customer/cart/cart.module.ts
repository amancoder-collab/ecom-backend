import { forwardRef, Module } from '@nestjs/common';
import { Operation } from 'src/common/operations/operation.function';
import { ShippingModule } from 'src/shipping/shipping.module';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CustomerModule } from '../customer.module';

@Module({
  imports: [forwardRef(() => ShippingModule)],
  controllers: [CartController],
  providers: [CartService, Operation],
  exports: [CartService],
})
export class CartModule {}

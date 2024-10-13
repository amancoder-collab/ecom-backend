import { forwardRef, Module } from '@nestjs/common';
import { ShippingModule } from 'src/shipping/shipping.module';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CartModule } from '../cart/cart.module';

@Module({
  imports: [forwardRef(() => ShippingModule), forwardRef(() => CartModule)],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}

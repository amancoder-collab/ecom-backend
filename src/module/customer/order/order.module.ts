import { forwardRef, Module } from '@nestjs/common';
import { ShippingModule } from 'src/shipping/shipping.module';
import { CartModule } from '../cart/cart.module';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { RabbitMQModule } from 'src/rabbitmq/rabbitmq.module';

@Module({
  imports: [forwardRef(() => ShippingModule), forwardRef(() => CartModule)],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}

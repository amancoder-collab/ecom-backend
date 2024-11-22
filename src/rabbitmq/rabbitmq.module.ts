import { forwardRef, Global, Module } from '@nestjs/common';
import { ShippingModule } from 'src/shipping/shipping.module';
import { ShippingConsumer } from './consumers/shipping.consumer';
import { OrderProducer } from './producers/order.producer';
import { RabbitMQCoreModule } from './rabbitmq-core.module';

@Global()
@Module({
  imports: [RabbitMQCoreModule, forwardRef(() => ShippingModule)],
  providers: [OrderProducer, ShippingConsumer],
  exports: [OrderProducer, ShippingConsumer],
})
export class RabbitMQModule {}

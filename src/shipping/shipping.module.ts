import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { CartModule } from 'src/module/customer/cart/cart.module';
import { OrderModule } from 'src/module/customer/order/order.module';
import { ShippingController } from './shipping.controller';
import { ShippingService } from './shipping.service';

@Module({
  imports: [
    HttpModule,
    forwardRef(() => CartModule),
    forwardRef(() => OrderModule),
  ],
  controllers: [ShippingController],
  providers: [ShippingService],
  exports: [ShippingService],
})
export class ShippingModule {}

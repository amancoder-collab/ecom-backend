import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { CartService } from 'src/module/customer/cart/cart.service';
import { ShippingController } from './shipping.controller';
import { ShippingService } from './shipping.service';
import { CartModule } from 'src/module/customer/cart/cart.module';

@Module({
  imports: [HttpModule, forwardRef(() => CartModule)],
  controllers: [ShippingController],
  providers: [ShippingService],
  exports: [ShippingService],
})
export class ShippingModule {}

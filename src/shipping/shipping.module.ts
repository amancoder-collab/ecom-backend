import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CartService } from 'src/module/customer/cart/cart.service';
import { ShippingController } from './shipping.controller';
import { ShippingService } from './shipping.service';

@Module({
  imports: [HttpModule],
  controllers: [ShippingController],
  providers: [ShippingService, CartService],
  exports: [ShippingService],
})
export class ShippingModule {}

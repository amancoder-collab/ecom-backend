import { Module } from '@nestjs/common';
import { CartModule } from './cart/cart.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    AuthModule,
    CartModule,
    DashboardModule,
    OrderModule,
    ProductModule,
  ],
})
export class CustomerModule {}

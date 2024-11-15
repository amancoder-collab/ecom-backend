import { Module, Global } from '@nestjs/common';
import { CartModule } from './cart/cart.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { AuthModule } from './auth/auth.module';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';

@Global()
@Module({
  imports: [
    AuthModule,
    CartModule,
    DashboardModule,
    OrderModule,
    ProductModule,
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}

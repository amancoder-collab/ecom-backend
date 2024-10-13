import { Module, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AllExceptionsFilter } from './common/filters/all.exception.filter';
import { HttpExceptionFilter } from './common/filters/http.exception.filter';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';
import { CouponsModule } from './module/admin/coupons/coupons.module';
import { ProductsModule } from './module/admin/products/products.module';
import { AuthModule } from './module/customer/auth/auth.module';
import { CartModule } from './module/customer/cart/cart.module';
import { DashboardModule } from './module/customer/dashboard/dashboard.module';
import { OrderController } from './module/customer/order/order.controller';
import { OrderModule } from './module/customer/order/order.module';
import { ProductModule } from './module/customer/product/product.module';
import { ReviewModule } from './module/customer/review/review.module';
import { SubscribeModule } from './module/customer/subscribe/subscribe.module';
import { PrismaModule } from './module/prisma/prisma.module';
import { ShippingModule } from './shipping/shipping.module';

@Module({
  imports: [
    OrderModule,
    PrismaModule,
    ProductsModule,
    CouponsModule,
    AuthModule,
    DashboardModule,
    CartModule,
    ReviewModule,
    ProductModule,
    SubscribeModule,
    ShippingModule,
  ],
  controllers: [OrderController, AppController],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_PIPE, useClass: ValidationPipe },
    AppService,
  ],
})
export class AppModule {}

import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { HttpExceptionFilter } from './common/filters/http.exception.filter';
import { AllExceptionsFilter } from './common/filters/all.exception.filter';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';
import { PrismaModule } from './module/prisma/prisma.module';
import { AuthModule } from './module/customer/auth/auth.module';
import { ProductsModule } from './module/admin/products/products.module';
import { CartModule } from './module/customer/cart/cart.module';
import { AddressModule } from './module/customer/address/address.module';
import { ReviewModule } from './module/customer/review/review.module';

@Module({
    imports: [
        PrismaModule,
        ProductsModule,
        AuthModule,
        CartModule,
        AddressModule,
        ReviewModule,
    ],
    controllers: [AppController],
    providers: [
        { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
        { provide: APP_FILTER, useClass: AllExceptionsFilter },
        { provide: APP_FILTER, useClass: HttpExceptionFilter },
        { provide: APP_PIPE, useClass: ValidationPipe },
        AppService,
    ],
})
export class AppModule {}

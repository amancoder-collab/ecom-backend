import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { HttpExceptionFilter } from './common/filters/http.exception.filter';
import { AllExceptionsFilter } from './common/filters/all.exception.filter';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';
import { PrismaModule } from './module/prisma/prisma.module';
import { AuthModule } from './module/customer/auth/auth.module';

@Module({
    imports: [PrismaModule, AuthModule],
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

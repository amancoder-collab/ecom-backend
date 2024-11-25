import { Module, ValidationPipe } from "@nestjs/common";
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AllExceptionsFilter } from "./common/filters/all.exception.filter";
import { HttpExceptionFilter } from "./common/filters/http.exception.filter";
import { CacheControlInterceptor } from "./common/interceptor/cache-control.interceptor";
import { CleanupInterceptor } from "./common/interceptor/cleanup.interceptor";
import { ResponseInterceptor } from "./common/interceptor/response.interceptor";
import { TimeoutInterceptor } from "./common/interceptor/timeout.interceptor";
import { AdminModule } from "./module/admin/admin.module";
import { CustomerModule } from "./module/customer/customer.module";
import { LoggerModule } from "./module/logger/logger.module";
import { RabbitMQModule } from "./rabbitmq/rabbitmq.module";

@Module({
  imports: [RabbitMQModule, CustomerModule, LoggerModule, AdminModule],
  controllers: [AppController],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
    { provide: APP_INTERCEPTOR, useClass: TimeoutInterceptor },
    { provide: APP_INTERCEPTOR, useClass: CacheControlInterceptor },
    { provide: APP_INTERCEPTOR, useClass: CleanupInterceptor },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    AppService,
  ],
})
export class AppModule {}

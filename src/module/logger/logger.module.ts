import { Global, Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './logger.config';
import { CustomLoggerService } from './logger.service';

@Global()
@Module({
  imports: [WinstonModule.forRoot(winstonConfig)],
  providers: [CustomLoggerService],
  exports: [CustomLoggerService],
})
export class LoggerModule {}

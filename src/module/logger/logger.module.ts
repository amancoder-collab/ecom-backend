import { Global, Module } from '@nestjs/common';
import { CustomLogger } from './logger.service';
import { winstonConfig } from './logger.config';
import { WinstonModule } from 'nest-winston';

@Global()
@Module({
  imports: [WinstonModule.forRoot(winstonConfig)],
  providers: [CustomLogger],
  exports: [CustomLogger],
})
export class LoggerModule {}

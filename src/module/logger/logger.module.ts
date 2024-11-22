import { Global, Module } from '@nestjs/common';
import { winstonConfig } from './logger.config';
import { WinstonModule } from 'nest-winston';

@Global()
@Module({
  imports: [WinstonModule.forRoot(winstonConfig)],
})
export class LoggerModule {}

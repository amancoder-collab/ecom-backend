import { Injectable, LoggerService } from '@nestjs/common';
import { createLogger, Logger as WinstonLogger } from 'winston';
import { winstonConfig } from './logger.config';

@Injectable()
export class CustomLogger implements LoggerService {
  private logger: WinstonLogger;

  constructor() {
    this.logger = createLogger({
      ...winstonConfig,
    });
  }

  log(message: string, context?: unknown) {
    this.logger.info(message, { context });
  }

  error(message: any, trace?: unknown, context?: unknown) {
    this.logger.error(message, { trace, context });
  }

  warn(message: string, context?: unknown) {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: unknown) {
    this.logger.debug(message, { context });
  }

  verbose(message: string, context?: unknown) {
    this.logger.verbose(message, { context });
  }
}

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { makeResponse } from '../types/responce.type';

@Injectable()
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}
  private readonly logger = new Logger('All Exception Filter');

  catch(exception: unknown, host: ArgumentsHost): void {
    this.forHttpHost(host, exception);
  }

  private forHttpHost(host: ArgumentsHost, exception: unknown) {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const request = ctx.getRequest();

    this.logger.error(exception);

    httpAdapter.reply(
      ctx.getResponse(),
      makeResponse({
        success: false,
        error: `${httpAdapter.getRequestUrl(request)}`,
        status: httpStatus,
        message: 'INTERNAL SERVER ERROR',
        data: {},
      }),
      httpStatus,
    );
  }
}

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { isObject } from '@nestjs/common/utils/shared.utils';
import { Request, Response } from 'express';
import { makeResponse } from '../types/responce.type';

@Injectable()
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('HttpExceptionFilter');

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    this.logger.error(exception);

    const res = exception.getResponse() as
      | string
      | {
          success?: boolean;
          message: string | string[];
          error?: string;
          data?: object;
        };

    let msg;
    let error = '';
    let success = false;
    let data = {};

    if (isObject(res)) {
      msg = Array.isArray(res.message) ? res.message.pop() : res.message;
      error = typeof res.error === 'string' ? res.error : '';
      data = res.data ?? {};
      success = res.success ?? false;
    } else {
      msg = res;
    }

    response.status(exception.getStatus()).json(
      makeResponse({
        success: success,
        status: exception.getStatus(),
        error: error,
        message: msg,
        data: data,
      }),
    );
  }
}

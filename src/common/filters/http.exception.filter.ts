import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    Injectable,
} from '@nestjs/common';
import { isObject } from '@nestjs/common/utils/shared.utils';
import { Request, Response } from 'express';
import { makeResponse } from '../types/responce.type';

@Injectable()
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        console.error('error in http exception', {
            ...exception,
            path: request.url,
        });

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

        console.log('::: ERROR :::', error);

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

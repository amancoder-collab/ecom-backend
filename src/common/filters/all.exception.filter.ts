import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Injectable,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { makeResponse } from '../types/responce.type';

@Injectable()
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

    catch(exception: unknown, host: ArgumentsHost): void {
        let errorMsg;
        try {
            errorMsg = exception;
        } catch (e) {
            errorMsg = 'INTERNAL_SERVER_ERROR';
        }
        const errorString = errorMsg as Error;
        this.forHttpHost(host, exception, errorString);
    }

    private forHttpHost(
        host: ArgumentsHost,
        exception: unknown,
        errorString: Error,
    ) {
        const { httpAdapter } = this.httpAdapterHost;

        const ctx = host.switchToHttp();

        const httpStatus =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const request = ctx.getRequest();
        console.error(errorString);

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

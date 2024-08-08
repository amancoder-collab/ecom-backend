import { HttpException } from '@nestjs/common';

export default class HttpError extends HttpException {
    constructor(
        status: number,
        message: string,
        error?: string,
        success?: boolean,
    ) {
        super(
            { message, error: error ?? '', success: success ?? false },
            status,
        );
    }
}

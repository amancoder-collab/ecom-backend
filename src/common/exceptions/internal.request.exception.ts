import { HttpException } from '@nestjs/common';

export default class InternalRequestException extends HttpException {
    constructor(status: number, body: any) {
        super(body, status);
    }
}

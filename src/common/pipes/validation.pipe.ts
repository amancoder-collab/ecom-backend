import {
    Injectable,
    ValidationPipe as ValidationPipeBuiltin,
} from '@nestjs/common';
import { ValidationException } from '../exceptions/validation.exception';

@Injectable()
export class ValidationPipe extends ValidationPipeBuiltin {
    constructor() {
        super({
            transform: true,
            exceptionFactory: (errors) => new ValidationException(errors),
            transformOptions: {
                enableCircularCheck: true,
            },
        });
    }
}

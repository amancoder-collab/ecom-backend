import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonResponse } from '../types/responce.type';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<CommonResponse> {
        return next.handle().pipe(
            map((data) => {
                let message = 'success';
                if (data && typeof data === 'object' && 'message' in data) {
                    message = data.message;
                    delete data.message;
                }
                return {
                    success: true,
                    status: 200,
                    error: '',
                    data: data,
                    message: message,
                };
            }),
        );
    }
}

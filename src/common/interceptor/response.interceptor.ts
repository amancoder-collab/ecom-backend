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
        let meta = {};
        let finalData = {};

        if (data && typeof data === 'object' && 'message' in data) {
          message = data.message;
          delete data.message;
        }

        if (data && typeof data === 'object' && 'meta' in data) {
          meta = data.meta;
          delete data.meta;
        }

        if (data && typeof data === 'object' && 'data' in data) {
          finalData = data.data;
        } else {
          finalData = data;
        }

        return {
          success: true,
          status: 200,
          error: '',
          data: finalData,
          message: message,
          meta: meta,
        };
      }),
    );
  }
}

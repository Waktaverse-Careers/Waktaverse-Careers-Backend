// src/interceptors/response.interceptor.ts

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const statusCode = context.switchToHttp().getResponse().statusCode;

        const messages: Record<number, string> = {
          200: '요청이 성공적으로 처리되었습니다.',
          201: '새로운 자원이 성공적으로 생성되었습니다.',
          204: '요청이 성공적으로 처리되었으나 반환할 데이터가 없습니다.',
          404: '요청한 자원을 찾을 수 없습니다.',
          500: '서버 내부 오류가 발생했습니다.',
        };

        const message =
          messages[statusCode] || '알 수 없는 오류가 발생했습니다.';

        return {
          status: statusCode,
          data: data,
          message: message,
        };
      }),
      catchError((error) => {
        const statusCode = error.status || 500; // 기본값으로 500 설정
        const messages: Record<number, string> = {
          400: '잘못된 요청입니다.',
          401: '인증이 필요합니다.',
          403: '접근이 거부되었습니다.',
          404: '요청한 자원을 찾을 수 없습니다.',
          500: '서버 내부 오류가 발생했습니다.',
        };

        const message =
          messages[statusCode] || '알 수 없는 오류가 발생했습니다.';

        return of({
          status: statusCode,
          message: message,
          error: error.response,
        });
      }),
    );
  }
}

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { createResult, HTTP_STATUS_CODE_ENUM, IResponse } from '../../shared';

@Injectable()
export class ResultInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  public intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response: IResponse = context.switchToHttp().getResponse();
    const disableResult = this.reflector.get<boolean>('disableResult', context.getHandler());
    return next.handle().pipe(
      map((data) => {
        const code = response.statusCode;
        if (!disableResult) {
          response.status(HTTP_STATUS_CODE_ENUM.OK);
          return createResult(data, code);
        } else {
          return data;
        }
      }),
    );
  }
}

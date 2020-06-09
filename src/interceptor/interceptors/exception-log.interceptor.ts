import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Logger } from '../../logger';
import { IRequest } from '../../shared';

@Injectable()
export class ExceptionLogInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  public intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const disableExceptionLogEnable = this.reflector.get<boolean>(
      'disableExceptionLogEnable',
      context.getHandler(),
    );
    const request: IRequest = context.switchToHttp().getRequest();
    return next.handle().pipe(
      catchError((error: Error) => {
        if (!disableExceptionLogEnable) {
          let message = `[${request.method.toUpperCase()}]${request.url}`;
          if (request.body) {
            message += `\nbody: ${JSON.stringify(request.body)}`;
          }
          Logger.log(message, 'InterceptorModule ExceptionLogInterceptor');
          Logger.error(
            error.message,
            'InterceptorModule ExceptionLogInterceptor Error',
            error.stack,
          );
        }
        return throwError(error);
      }),
    );
  }
}

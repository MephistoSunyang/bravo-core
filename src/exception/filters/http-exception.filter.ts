import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { IResponse } from '../../shared/';
import { handleException } from '../exception.utils';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  public catch(exception: HttpException, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const response: IResponse = http.getResponse();
    handleException(exception, response);
  }
}

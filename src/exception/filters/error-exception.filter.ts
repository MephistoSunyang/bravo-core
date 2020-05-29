import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { IResponse } from '../../shared/';
import { handleException } from '../exception.utils';

@Catch(Error)
export class ErrorExceptionFilter implements ExceptionFilter {
  public catch(error: Error, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const response: IResponse = http.getResponse();
    handleException(error, response);
  }
}

import { Injectable, NestMiddleware } from '@nestjs/common';
import httpContext from 'express-http-context';
import { IRequest, IResponse } from '../../shared';

@Injectable()
export class GetCurrentUserMiddleware implements NestMiddleware {
  public async use(request: IRequest, response: IResponse, next: () => void): Promise<void> {
    if (request.user) {
      httpContext.set('user', request.user);
    }
    next();
  }
}

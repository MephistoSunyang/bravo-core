import { Injectable, NestMiddleware } from '@nestjs/common';
import { IRequest, IResponse } from '../../shared';

@Injectable()
export class SetHostMiddleware implements NestMiddleware {
  public async use(request: IRequest, response: IResponse, next: () => void): Promise<void> {
    if (!process.env.HOST) {
      let host = `${request.protocol}://${request.hostname}`;
      const port = process.env.PORT ? Number(process.env.PORT) : 8080;
      if (request.protocol === 'http' && port !== 80) {
        host += `:${port}`;
      }
      process.env.HOST = host;
    }
    next();
  }
}

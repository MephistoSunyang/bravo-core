import { Injectable, NestMiddleware } from '@nestjs/common';
import _ from 'lodash';
import { IRequest, IResponse } from '../../shared';

@Injectable()
export class KeepHeaderMiddleware implements NestMiddleware {
  public async use(request: IRequest, response: IResponse, next: () => void): Promise<void> {
    _.forIn(request.headers, (header, value) => {
      if (value.substr(0, 2) === 'x-') {
        response.setHeader(_.map(value.split('-'), _.capitalize).join('-'), _.toString(header));
      }
    });
    next();
  }
}

import { Module } from '@nestjs/common';
import { GetCurrentUserMiddleware, SetHostMiddleware } from './middlewares';

const middlewares = [GetCurrentUserMiddleware, SetHostMiddleware];
const providers = [...middlewares];

@Module({
  providers,
})
export class MiddlewareModule {}

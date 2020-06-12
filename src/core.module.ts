import { Module } from '@nestjs/common';
import { ExceptionModule } from './exception';
import { InterceptorModule } from './interceptor';
import { MiddlewareModule } from './middleware';

const modules = [ExceptionModule, InterceptorModule, MiddlewareModule];

@Module({
  imports: [...modules],
})
export class CoreModule {}

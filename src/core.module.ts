import { Module } from '@nestjs/common';
import { ExceptionModule } from './exception';
import { InterceptorModule } from './interceptor';
import { MiddlewareModule } from './middleware';
import { ValidatorModule } from './validator';

const modules = [ExceptionModule, InterceptorModule, MiddlewareModule, ValidatorModule];

@Module({
  imports: [...modules],
})
export class CoreModule {}

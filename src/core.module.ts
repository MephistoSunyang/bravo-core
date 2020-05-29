import { Module } from '@nestjs/common';
import { ExceptionModule } from './exception';
import { InterceptorModule } from './interceptor';

const modules = [ExceptionModule, InterceptorModule];

@Module({
  imports: [...modules],
})
export class CoreModule {}

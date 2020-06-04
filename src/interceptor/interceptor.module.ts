import { Module } from '@nestjs/common';
import { ExceptionLogInterceptor, ResultInterceptor } from './interceptors';

const interceptors = [ExceptionLogInterceptor, ResultInterceptor];
const providers = [...interceptors];

@Module({
  providers,
})
export class InterceptorModule {}

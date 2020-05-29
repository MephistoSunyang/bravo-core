import { Module } from '@nestjs/common';
import { ExceptionLogInterceptor, ResultInterceptor } from './interceptors';

const interceptors = [ExceptionLogInterceptor, ResultInterceptor];
const services = [...interceptors];

@Module({
  providers: [...services],
})
export class InterceptorModule {}

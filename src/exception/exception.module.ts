import { Module } from '@nestjs/common';
import { ErrorExceptionFilter, HttpExceptionFilter } from './filters';

const filters = [ErrorExceptionFilter, HttpExceptionFilter];
const providers = [...filters];

@Module({
  providers,
})
export class ExceptionModule {}

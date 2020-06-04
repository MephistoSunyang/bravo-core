import { Module } from '@nestjs/common';
import { ValidationPipe } from './pipes';

const pipes = [ValidationPipe];
const providers = [...pipes];

@Module({
  providers,
})
export class ValidationModule {}

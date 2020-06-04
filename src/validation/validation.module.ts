import { Module } from '@nestjs/common';
import { ValidationPipe } from './pipes';

const pipes = [ValidationPipe];
const services = [...pipes];

@Module({
  providers: [...services],
})
export class ValidationModule {}

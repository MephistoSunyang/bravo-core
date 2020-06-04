import { Module } from '@nestjs/common';
import { ValidatorPipe } from './pipes';

const pipes = [ValidatorPipe];
const services = [...pipes];

@Module({
  providers: [...services],
})
export class ValidatorModule {}

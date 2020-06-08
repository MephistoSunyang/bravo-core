import { Module } from '@nestjs/common';
import { ValidatorPipe } from './pipes';

const pipes = [ValidatorPipe];
const providers = [...pipes];

@Module({
  providers,
})
export class ValidatorModule {}

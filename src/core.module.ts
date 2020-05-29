import { Module } from '@nestjs/common';
import { ExceptionModule } from './exception';

const modules = [ExceptionModule];

@Module({
  imports: [...modules],
})
export class CoreModule {}

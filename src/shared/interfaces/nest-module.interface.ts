import { DynamicModule, ForwardReference, Type } from '@nestjs/common';

export type INestModule = Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference;

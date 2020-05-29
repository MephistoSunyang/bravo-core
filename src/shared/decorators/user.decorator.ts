import { createParamDecorator } from '@nestjs/common';
import { IRequest } from '../interfaces';

export const User = createParamDecorator((field: string, request: IRequest) =>
  request.user ? (field ? request.user[field] : request.user) : null,
);

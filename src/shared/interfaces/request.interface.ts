import { Request } from 'express';

export interface IRequest extends Request {
  [name: string]: any;
}

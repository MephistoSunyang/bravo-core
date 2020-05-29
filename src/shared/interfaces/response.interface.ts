import { Response } from 'express';

export interface IResponse extends Response {
  [name: string]: any;
}

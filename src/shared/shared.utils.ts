import { HttpException } from '@nestjs/common';
import _ from 'lodash';
import { BusinessException } from '../exception';
import { ENVIRONMENT_ENUM, HTTP_STATUS_CODE_ENUM } from './enums';
import { IResult } from './interfaces';

export const isLocal = () =>
  process.env.ENVIRONMENT &&
  process.env.ENVIRONMENT.toUpperCase() === ENVIRONMENT_ENUM.LOCAL.toUpperCase();

export const isDevelopment = () =>
  process.env.ENVIRONMENT &&
  process.env.ENVIRONMENT.toUpperCase() === ENVIRONMENT_ENUM.DEVELOPMENT.toUpperCase();

export const isQuality = () =>
  process.env.ENVIRONMENT &&
  process.env.ENVIRONMENT.toUpperCase() === ENVIRONMENT_ENUM.QUALITY.toUpperCase();

export const isProduction = () =>
  process.env.ENVIRONMENT &&
  process.env.ENVIRONMENT.toUpperCase() === ENVIRONMENT_ENUM.PRODUCTION.toUpperCase();

export function createResult(error?: Error | HttpException): IResult;
export function createResult(error?: Error | HttpException, code?: number): IResult;
export function createResult(content?: any): IResult;
export function createResult(content?: any, code?: number): IResult;
export function createResult(
  contentOrError: any = {},
  code: number = HTTP_STATUS_CODE_ENUM.OK,
): IResult {
  let content: any = {};
  let message = '';
  if (contentOrError instanceof BusinessException) {
    if (contentOrError.frontendMessage) {
      message = contentOrError.frontendMessage;
    }
  } else if (contentOrError instanceof HttpException) {
    code = contentOrError.getStatus();
  } else if (contentOrError instanceof Error) {
    code = HTTP_STATUS_CODE_ENUM.INTERNAL_SERVER_ERROR;
  } else {
    content = contentOrError;
  }
  const result: IResult = {
    content,
    code,
    message,
  };
  return result;
}

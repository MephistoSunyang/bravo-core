import { HttpException } from '@nestjs/common';
import { createResult, HTTP_STATUS_CODE_ENUM, IResponse } from '../shared';
import { BusinessException } from './exceptions';

export const handleException = (error: Error | HttpException, response: IResponse): void => {
  let status = HTTP_STATUS_CODE_ENUM.INTERNAL_SERVER_ERROR;
  let code = HTTP_STATUS_CODE_ENUM.INTERNAL_SERVER_ERROR;
  if (error instanceof BusinessException) {
    status = HTTP_STATUS_CODE_ENUM.BAD_REQUEST;
    code = error.getStatus();
  } else if (error instanceof HttpException) {
    status = code = error.getStatus();
  }
  response.status(status).send(createResult(error, code));
};

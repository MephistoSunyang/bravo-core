import { HttpException } from '@nestjs/common';
import { HTTP_STATUS_CODE_ENUM } from '../../shared';

export class BusinessException extends HttpException {
  public frontendMessage: string;

  constructor(message: string, frontendMessage?: string);
  constructor(message: string, code?: number);
  constructor(message: string, code?: number, frontendMessage?: string);
  constructor(message: string, codeOrFrontendMessage?: number | string, frontendMessage = '') {
    let code = HTTP_STATUS_CODE_ENUM.BAD_REQUEST;
    if (codeOrFrontendMessage) {
      if (typeof codeOrFrontendMessage === 'string') {
        frontendMessage = codeOrFrontendMessage;
      } else {
        code = codeOrFrontendMessage;
      }
    }
    super(message, code);
    this.frontendMessage = frontendMessage;
  }
}

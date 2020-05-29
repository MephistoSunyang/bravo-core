import { Logger as NestLogger, LoggerService } from '@nestjs/common';
import { logger } from './logger.utils';

export class Logger extends NestLogger implements LoggerService {
  public static verbose(message: any, context = 'Nest Application Verbose'): void {
    super.verbose(message, context);
  }

  public static debug(message: any, context = 'Nest Application Debug'): void {
    super.debug(message, context);
  }

  public static log(message: any, context = 'Nest Application Log'): void {
    logger(`[${context}]`).info(message);
    super.log(message, context);
  }

  public static warn(message: any, context = 'Nest Application Warn'): void {
    logger(`[${context}]`).warn(message);
    super.warn(message, context);
  }

  public static error(message: any, context = 'Nest Application Error', trace = ''): void {
    const error = typeof message === 'object' ? JSON.stringify(message) : message;
    logger(`[${context}]`).error(error, trace);
    super.error(message, trace, context);
  }
}

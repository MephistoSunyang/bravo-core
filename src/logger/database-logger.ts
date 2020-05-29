import { AdvancedConsoleLogger, Logger, QueryRunner } from 'typeorm';
import { logger } from './logger.utils';

export class DatabaseLogger implements Logger {
  public advancedConsoleLogger: AdvancedConsoleLogger;

  constructor(
    options?:
      | boolean
      | 'all'
      | Array<'log' | 'info' | 'warn' | 'query' | 'schema' | 'error' | 'migration'>
      | undefined,
  ) {
    this.advancedConsoleLogger = new AdvancedConsoleLogger(options);
  }

  public log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner) {
    if (level === 'log') {
      logger('[Database Log]').log(message);
    }
    if (level === 'info') {
      logger('[Database Info]').info(message);
    }
    if (level === 'warn') {
      logger('[Database Warn]').warn(message);
    }
    this.advancedConsoleLogger.log(level, message, queryRunner);
  }

  public logMigration(message: string, queryRunner?: QueryRunner) {
    this.advancedConsoleLogger.logMigration(message, queryRunner);
  }

  public logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    this.advancedConsoleLogger.logQuery(query, parameters, queryRunner);
  }

  public logQueryError(
    error: string,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ) {
    logger('[Database Error]').error(error);
    this.advancedConsoleLogger.logQueryError(error, query, parameters, queryRunner);
  }

  public logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner) {
    this.advancedConsoleLogger.logQuerySlow(time, query, parameters, queryRunner);
  }

  public logSchemaBuild(message: string, queryRunner?: QueryRunner) {
    this.advancedConsoleLogger.logSchemaBuild(message, queryRunner);
  }
}

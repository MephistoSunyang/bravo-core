import _ from 'lodash';
import { IAuditLogMetadataArgs } from '../interfaces';

export class MetadataArgsStorage {
  public auditLogs: IAuditLogMetadataArgs[] = [];

  public findAuditLog(target: Function | string) {
    return _.find(this.auditLogs, { target });
  }
}

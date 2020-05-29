import { IAuditLogOptions } from '../../repository';

export interface IAuditLogMetadataArgs extends IAuditLogOptions {
  readonly target: Function | string;
}

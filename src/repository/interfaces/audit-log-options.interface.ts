import { IAuditLogContentResolver } from './audit-log-content-resolver.interface';
import { IAuditLogCreatedUserIdResolver } from './audit-log-created-user-id-resolver.interface';

export interface IAuditLogOptions {
  readonly enable: boolean;
  contentResolver: IAuditLogContentResolver;
  createdUserIdResolver: IAuditLogCreatedUserIdResolver;
}

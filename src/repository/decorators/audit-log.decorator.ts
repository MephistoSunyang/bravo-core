import _ from 'lodash';
import { getMetadataArgsStorage } from '../../metadata-storage';
import { getCurrentUserId } from '../../middleware';
import { IAuditLogOptions } from '../interfaces';

export const AuditLog = (
  options: IAuditLogOptions = {
    enable: true,
    contentResolver: (content) => JSON.stringify(content),
    createdUserIdResolver: () => (getCurrentUserId() ? String(getCurrentUserId()) : null),
  },
) => {
  return (entity: Function) => {
    getMetadataArgsStorage().auditLogs.push(_.assign({ target: entity }, options));
  };
};

import { IObject } from '../../shared';

export type IAuditLogContentResolver = (content: IObject) => string;

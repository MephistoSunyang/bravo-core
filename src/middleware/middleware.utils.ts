import httpContext from 'express-http-context';
import { IObject } from '../shared';

export function setCurrentUserId(userId: string) {
  httpContext.set('user', { id: userId });
}

export function getCurrentUser<IData = IObject>(field?: string): IData | null {
  const user = httpContext.get('user') as IData;
  return user ? (field ? user[field] : user) : null;
}

export function getCurrentUserId() {
  const user = getCurrentUser();
  return user ? Number(user.id) : null;
}

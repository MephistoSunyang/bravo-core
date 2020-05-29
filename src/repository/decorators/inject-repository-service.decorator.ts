import { Inject } from '@nestjs/common';
import { getRepositoryServiceToken } from '../repository.utils';

export const InjectRepositoryService = (entity: Function) =>
  Inject(getRepositoryServiceToken(entity));

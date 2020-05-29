import { Provider } from '@nestjs/common';
import { FactoryProvider } from '@nestjs/common/interfaces';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuditLogService, RepositoryService } from './services';

export const getRepositoryServiceProviders = (entities: Function[] = []): Provider[] => {
  const providers: Provider[] = entities.map((entity) => {
    const provider: FactoryProvider = {
      provide: getRepositoryServiceToken(entity),
      inject: [getRepositoryToken(entity), AuditLogService],
      useFactory: (repository, auditLogService) => {
        return new RepositoryService(repository, auditLogService);
      },
    };
    return provider;
  });
  return providers;
};

export const getRepositoryServiceToken = (entity: Function) =>
  `${entity.name}RepositoryServiceToken`;

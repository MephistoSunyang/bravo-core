import { DynamicModule, Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLogEntity } from './entities';
import { getRepositoryServiceProviders } from './repository.utils';
import { AuditLogService } from './services';

@Global()
@Module({})
export class RepositoryModule {
  public static forFeature(entities: Function[]): DynamicModule {
    const modules = [TypeOrmModule.forFeature([AuditLogEntity, ...entities])];
    const services = [AuditLogService, ...getRepositoryServiceProviders(entities)];
    const providers = [...services];
    return {
      module: RepositoryModule,
      imports: [...modules],
      providers,
      exports: [...providers],
    };
  }
}

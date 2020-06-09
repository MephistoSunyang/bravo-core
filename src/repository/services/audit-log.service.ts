import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { EntityMetadata, ObjectLiteral, Repository } from 'typeorm';
import { Logger } from '../../logger';
import { getMetadataArgsStorage } from '../../metadata-storage';
import { AuditLogEntity } from '../entities';
import { IAuditLogAction, IAuditLogContentResolver } from '../interfaces';

@Injectable()
export class AuditLogService<Entity extends ObjectLiteral> {
  constructor(
    @InjectRepository(AuditLogEntity)
    private readonly auditLogRepository: Repository<AuditLogEntity>,
  ) {}

  private getAuditLogModels(
    metadata: EntityMetadata,
    action: IAuditLogAction,
    entities: Entity[],
    contentResolver: IAuditLogContentResolver,
    createdUserId: string | null,
  ): AuditLogEntity[] {
    const schemaName = metadata.schema ? metadata.schema : 'dbo';
    const tableName = metadata.tableName;
    const models = entities.map((entity) =>
      this.auditLogRepository.create({
        schemaName,
        tableName,
        action,
        content: contentResolver(entity),
        createdUserId,
      }),
    );
    return models;
  }

  public async insert(
    metadata: EntityMetadata,
    action: IAuditLogAction,
    entities: Entity[],
  ): Promise<void>;
  public async insert(
    metadata: EntityMetadata,
    action: IAuditLogAction,
    entity: Entity,
  ): Promise<void>;
  public async insert(
    metadata: EntityMetadata,
    action: IAuditLogAction,
    entityOrEntities: Entity[] | Entity,
  ): Promise<void> {
    const auditLogMetadata = getMetadataArgsStorage().findAuditLog(metadata.target);
    if (!auditLogMetadata || !auditLogMetadata.enable) {
      return;
    }
    const createdUserId = auditLogMetadata.createdUserIdResolver();
    const auditLogModels = this.getAuditLogModels(
      metadata,
      action,
      _.castArray<Entity>(entityOrEntities),
      auditLogMetadata.contentResolver,
      createdUserId,
    );
    if (auditLogModels.length === 0) {
      return;
    }
    try {
      this.auditLogRepository.save(auditLogModels, { chunk: 200 });
    } catch (error) {
      Logger.log(auditLogModels, 'RepositoryModule AuditLogService');
      Logger.error((error as Error).message, 'RepositoryModule AuditLogService Error');
    }
  }
}

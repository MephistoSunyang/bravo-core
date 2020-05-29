import { Injectable } from '@nestjs/common';
import _ from 'lodash';
import {
  DeepPartial,
  EntityManager,
  EntityMetadata,
  FindConditions,
  FindManyOptions,
  FindOneOptions,
  ObjectLiteral,
  QueryRunner,
  RemoveOptions,
  Repository,
  SaveOptions,
  SelectQueryBuilder,
} from 'typeorm';
import { IObject } from '../../shared';
import { AUDIT_LOG_ACTION_ENUM } from '../enums';
import { AuditLogService } from './audit-log.service';

@Injectable()
export class RepositoryService<Entity extends ObjectLiteral> {
  public readonly manager: EntityManager;
  public readonly metadata: EntityMetadata;
  public readonly queryRunner?: QueryRunner;
  public get isSoftDelete() {
    return this.metadata.deleteColumn !== undefined;
  }
  public get softDeleteField() {
    return this.metadata.deleteColumn ? this.metadata.deleteColumn.propertyName : '';
  }

  constructor(
    public readonly repository: Repository<Entity>,
    public readonly auditLogService: AuditLogService<Entity>,
  ) {
    this.manager = repository.manager;
    this.metadata = repository.metadata;
    this.queryRunner = repository.queryRunner;
  }

  private async getEntitiesByIdsOrConditions(idsOrConditions: number[] | FindConditions<Entity>) {
    const entities =
      _.isArray(idsOrConditions) && _.isNumber(idsOrConditions[0])
        ? await this.findByIds(idsOrConditions)
        : await this.find(idsOrConditions as any);
    return entities;
  }

  public create(): Entity;
  public create(entityLikeArray: DeepPartial<Entity>[]): Entity[];
  public create(entityLike: DeepPartial<Entity>): Entity;
  public create(
    entityLikeOrEntityLikes?: DeepPartial<Entity> | DeepPartial<Entity>[],
  ): Entity | Entity[] {
    return this.repository.create(entityLikeOrEntityLikes as any);
  }

  public merge(...entityLikes: DeepPartial<Entity>[]): Entity {
    return this.repository.merge(this.create(), ...entityLikes);
  }

  public count(options?: FindManyOptions<Entity>): Promise<number>;
  public count(options?: FindConditions<Entity>): Promise<number>;
  public count(
    optionsOrConditions?: FindManyOptions<Entity> | FindConditions<Entity>,
  ): Promise<number> {
    return this.repository.count(optionsOrConditions);
  }

  public find(options?: FindManyOptions<Entity>): Promise<Entity[]>;
  public find(conditions?: FindConditions<Entity>): Promise<Entity[]>;
  public find(
    optionsOrConditions?: FindManyOptions<Entity> | FindConditions<Entity>,
  ): Promise<Entity[]> {
    return this.repository.find(optionsOrConditions);
  }

  public findAndCount(options?: FindManyOptions<Entity>): Promise<[Entity[], number]>;
  public findAndCount(conditions?: FindConditions<Entity>): Promise<[Entity[], number]>;
  public findAndCount(
    optionsOrConditions?: FindManyOptions<Entity> | FindConditions<Entity>,
  ): Promise<[Entity[], number]> {
    return this.repository.findAndCount(optionsOrConditions);
  }

  public async findByIds(ids: number[], options?: FindManyOptions<Entity>): Promise<Entity[]>;
  public async findByIds(ids: number[], conditions?: FindConditions<Entity>): Promise<Entity[]>;
  public async findByIds(
    ids: number[],
    optionsOrConditions?: FindManyOptions<Entity> | FindConditions<Entity>,
  ): Promise<Entity[]> {
    const chunkEntities = await Promise.all(
      _.chain(ids)
        .uniq()
        .chunk(2000)
        .map((chunkIds) => this.repository.findByIds(chunkIds, optionsOrConditions))
        .value(),
    );
    const entities = _.flatMap(chunkEntities);
    return entities;
  }

  public findOne(id?: number, options?: FindOneOptions<Entity>): Promise<Entity | undefined>;
  public findOne(options?: FindOneOptions<Entity>): Promise<Entity | undefined>;
  public findOne(
    conditions?: FindConditions<Entity>,
    options?: FindOneOptions<Entity>,
  ): Promise<Entity | undefined>;
  public findOne(
    idOrOptionsOrConditions?: number | FindOneOptions<Entity> | FindConditions<Entity>,
    maybeOptions?: FindOneOptions<Entity>,
  ): Promise<Entity | undefined> {
    return this.repository.findOne(idOrOptionsOrConditions as any, maybeOptions);
  }

  public async insert(partialModel: DeepPartial<Entity>, options?: SaveOptions): Promise<Entity> {
    const entity = await this.repository.save(partialModel, options);
    this.auditLogService.insert(this.metadata, AUDIT_LOG_ACTION_ENUM.CREATE, entity);
    return entity;
  }

  public async insertBulk(
    partialModels: DeepPartial<Entity>[],
    options?: SaveOptions,
  ): Promise<Entity[]> {
    if (partialModels.length === 0) {
      return [];
    }
    const entities = await this.repository.save(partialModels, options);
    this.auditLogService.insert(this.metadata, AUDIT_LOG_ACTION_ENUM.CREATE, entities);
    return entities;
  }

  public async update(
    id: number,
    partialModel: DeepPartial<Entity>,
    options?: SaveOptions,
  ): Promise<Entity | undefined>;
  public async update(
    conditions: FindConditions<Entity>,
    partialModel: DeepPartial<Entity>,
    options?: SaveOptions,
  ): Promise<Entity | undefined>;
  public async update(
    idOrConditions: number | FindConditions<Entity>,
    partialModel: DeepPartial<Entity>,
    options?: SaveOptions,
  ): Promise<Entity | undefined> {
    const entity = await this.findOne(idOrConditions as any);
    if (!entity) {
      return;
    }
    const model = this.isSoftDelete
      ? this.merge(entity, partialModel, { [this.softDeleteField]: false } as any)
      : this.merge(entity, partialModel);
    const updatedEntity = await this.repository.save(model, options);
    this.auditLogService.insert(this.metadata, AUDIT_LOG_ACTION_ENUM.UPDATE, updatedEntity);
    return updatedEntity;
  }

  public async updateBulk(
    ids: number[],
    partialModels: DeepPartial<Entity>[],
    options?: SaveOptions,
  ): Promise<Entity[]>;
  public async updateBulk(
    ids: number[],
    partialModel: DeepPartial<Entity>,
    options?: SaveOptions,
  ): Promise<Entity[]>;
  public async updateBulk(
    conditions: FindConditions<Entity>,
    partialModels: DeepPartial<Entity>[],
    options?: SaveOptions,
  ): Promise<Entity[]>;
  public async updateBulk(
    conditions: FindConditions<Entity>,
    partialModels: DeepPartial<Entity>,
    options?: SaveOptions,
  ): Promise<Entity[]>;
  public async updateBulk(
    idsOrConditions: number[] | FindConditions<Entity>,
    partialModelOrPartialModels: DeepPartial<Entity>[] | DeepPartial<Entity>,
    options?: SaveOptions,
  ): Promise<Entity[]> {
    const entities = await this.getEntitiesByIdsOrConditions(idsOrConditions);
    if (entities.length === 0) {
      return [];
    }
    const models = entities.map((entity, index) =>
      this.isSoftDelete
        ? this.merge(
            entity,
            _.isArray(partialModelOrPartialModels)
              ? partialModelOrPartialModels[index]
              : partialModelOrPartialModels,
            { [this.softDeleteField]: false } as any,
          )
        : this.merge(
            entity,
            _.isArray(partialModelOrPartialModels)
              ? partialModelOrPartialModels[index]
              : partialModelOrPartialModels,
          ),
    );
    const updatedEntities = await this.repository.save(models, options);
    this.auditLogService.insert(this.metadata, AUDIT_LOG_ACTION_ENUM.UPDATE, updatedEntities);
    return updatedEntities;
  }

  public async delete(id: number, options?: RemoveOptions): Promise<Entity | undefined>;
  public async delete(
    conditions: FindConditions<Entity>,
    options?: RemoveOptions,
  ): Promise<Entity | undefined>;
  public async delete(
    idOrConditions: number | FindConditions<Entity>,
    options?: RemoveOptions,
  ): Promise<Entity | undefined> {
    const entity = await this.findOne(idOrConditions as any);
    if (!entity) {
      return;
    }
    let deletedEntity: Entity;
    if (this.isSoftDelete) {
      const model = this.merge(entity, { [this.softDeleteField]: true } as any);
      deletedEntity = await this.repository.save(model, options);
      this.auditLogService.insert(this.metadata, AUDIT_LOG_ACTION_ENUM.DELETE, deletedEntity);
    } else {
      deletedEntity = await this.repository.remove(entity, options);
      this.auditLogService.insert(this.metadata, AUDIT_LOG_ACTION_ENUM.DELETE, entity);
    }
    return deletedEntity;
  }

  public async deleteBulk(ids: number[], options?: RemoveOptions): Promise<Entity[]>;
  public async deleteBulk(
    conditions: FindConditions<Entity>,
    options?: RemoveOptions,
  ): Promise<Entity[]>;
  public async deleteBulk(
    idsOrConditions: number[] | FindConditions<Entity>,
    options?: RemoveOptions,
  ): Promise<Entity[]> {
    const entities = await this.getEntitiesByIdsOrConditions(idsOrConditions);
    if (entities.length === 0) {
      return [];
    }
    let deletedEntities: Entity[];
    if (this.isSoftDelete) {
      const models = entities.map((deletedEntity) =>
        this.merge(deletedEntity, { [this.softDeleteField]: true } as any),
      );
      deletedEntities = await this.repository.save(models, options);
      this.auditLogService.insert(this.metadata, AUDIT_LOG_ACTION_ENUM.DELETE, deletedEntities);
    } else {
      deletedEntities = await this.repository.remove(entities, options);
      this.auditLogService.insert(this.metadata, AUDIT_LOG_ACTION_ENUM.DELETE, entities);
    }
    return deletedEntities;
  }

  public createQueryBuilder(alias?: string, queryRunner?: QueryRunner): SelectQueryBuilder<Entity> {
    return this.repository.createQueryBuilder(alias, queryRunner);
  }

  public query<T = IObject[]>(query: string, parameters?: any[]): Promise<T> {
    return this.repository.query(query, parameters);
  }

  public clear(): Promise<void> {
    return this.repository.clear();
  }
}

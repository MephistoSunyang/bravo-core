import { DynamicModule, Global, Module, OnModuleInit } from '@nestjs/common';
import { InjectConnection, TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import _ from 'lodash';
import { Connection } from 'typeorm';

@Global()
@Module({})
export class DataBaseModule implements OnModuleInit {
  public static synchronize = false;

  constructor(@InjectConnection() private readonly connection: Connection) {}

  public static forRoot(options: TypeOrmModuleOptions): DynamicModule {
    this.synchronize = options.synchronize || false;
    const modules = [TypeOrmModule.forRoot(options)];
    return {
      module: DataBaseModule,
      imports: [...modules],
    };
  }

  public async onModuleInit(): Promise<void> {
    if (DataBaseModule.synchronize) {
      const { driver, entityMetadatas } = this.connection;
      const queryRunner = driver.createQueryRunner('master');
      const databaseSchemas = await queryRunner.getSchemas();
      const schemas = _.chain(entityMetadatas)
        .map('schema')
        .compact()
        .difference(databaseSchemas)
        .value();
      await Promise.all(schemas.map((schema) => queryRunner.createSchema(schema)));
      await this.connection.synchronize();
    }
  }
}

import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AUDIT_LOG_ACTION_ENUM } from '../enums';

@Entity({ schema: 'system', name: 'audit-logs' })
export class AuditLogEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column('varchar')
  public schemaName: string;

  @Column('varchar')
  public tableName: string;

  @Column('int')
  public tableId: string;

  @Column('varchar')
  public action: AUDIT_LOG_ACTION_ENUM;

  @Column('nvarchar', { length: 'MAX' })
  public content: string;

  @Column('nvarchar', { nullable: true })
  public createdUserId: string | null;

  @CreateDateColumn()
  public createdDate: Date;
}

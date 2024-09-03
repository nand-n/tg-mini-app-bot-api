import { BaseModel } from '@root/src/database/base.model';
import { Entity, Column } from 'typeorm';

@Entity('tenants')
export class Tenant extends BaseModel{

  @Column()
  tenantName: string;

  @Column()
  schemaName: string;

  @Column({ unique: true })
  botToken: string;

}

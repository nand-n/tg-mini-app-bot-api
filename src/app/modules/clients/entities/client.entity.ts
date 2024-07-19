import { BaseModel } from '@root/src/database/base.model';
import { Column } from 'typeorm';

export class Client extends BaseModel {
  @Column({ length: 500, type: 'varchar' })
  name: string;

  @Column({ length: 50, type: 'varchar' })
  email: string;

  @Column({ length: 50, type: 'varchar' })
  phoneNumber: string;
  @Column({ length: 50, type: 'varchar' })
  contactInfo: string;

  @Column({ length: 50, type: 'date' })
  licenseDate: Date;
  @Column({ length: 50, type: 'varchar' })
  status: string;

  //packageID: integer

  //databaseID: integer
}

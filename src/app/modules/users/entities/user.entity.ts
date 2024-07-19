// import { BaseModel } from '@root/src/database/base.entity';
import { BaseModel } from '../../../../database/base.model';
import { Entity, Column, OneToMany } from 'typeorm';
import { Product } from '../../products/entities/product.entity';

@Entity()
export class User extends BaseModel {
  @Column({ length: 500, type: 'varchar' })
  name: string;

  @Column({ length: 50, type: 'varchar' })
  email: string;

  @OneToMany(() => Product, (product) => product.user)
  products: Product[];
}

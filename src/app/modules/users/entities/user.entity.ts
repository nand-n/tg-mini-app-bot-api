import { BaseModel } from '../../../../database/base.model';
import { Entity, Column, OneToMany } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { Announcement } from '../../announcements/entities/announcement.entity';

@Entity()
export class User extends BaseModel {
  @Column({ length: 500, type: 'varchar' })
  name: string;

  @Column({ length: 50, type: 'varchar' })
  email: string;

  @OneToMany(() => Product, (product) => product.user)
  products: Product[];
  @OneToMany(() => Announcement, (ticket) => ticket.announcment)
  announcment: Announcement[];
}

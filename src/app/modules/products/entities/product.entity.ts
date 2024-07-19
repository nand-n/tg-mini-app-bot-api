import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
// import { BaseModel } from '@root/src/database/base.entity';
import { User } from '../../users/entities/user.entity';
import { BaseModel } from '../../../../database/base.model';

@Entity()
export class Product extends BaseModel {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  pictureUrl: string;

  @Column()
  category: string;

  @Column('decimal', { scale: 2 })
  price: number;

  @ManyToOne(() => User, (user) => user.products)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;

  @Column({ nullable: true })
  userId: string;
}

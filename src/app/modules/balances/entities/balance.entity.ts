import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { BaseModel } from '@root/src/database/base.model';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Balance extends BaseModel {
  // @OneToOne(() => User, (user) => user.balance)
  // user: User;

  @OneToOne(() => User, (user) => user.balance)
  @JoinColumn({ name: 'userId' })
  user: User;
  @Column({ type: 'decimal', default: 0 })
  diceBalance: number;

  @Column({ type: 'decimal', default: 0 })
  kenoBalance: number;

  @Column({ type: 'decimal', default: 0 })
  bingoBalance: number;
}

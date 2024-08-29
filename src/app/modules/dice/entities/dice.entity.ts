import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { BaseModel } from '@root/src/database/base.model';

@Entity()
export class Dice extends BaseModel {

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dicePlayTime: Date;

  @Column({ default: 0 })
  diceBalance: number; 

  @ManyToOne(() => User, user => user.dice, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'int' })
  userId: number;

  @Column({ default: 0 })
  diceRollResult: number;
}

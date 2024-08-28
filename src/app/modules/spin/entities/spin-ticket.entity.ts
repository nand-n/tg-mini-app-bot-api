import { Entity, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { BaseModel } from '@root/src/database/base.model';
import { Spin } from './spin.entity';

@Entity()
export class SpinTicket extends BaseModel {

  @Column({ type: 'boolean', default: false })
  used: boolean;  

  @ManyToOne(() => User, user => user.spinTickets, { onDelete: 'CASCADE' })
  user: User;

  @OneToOne(() => Spin, spin => spin.ticket)
  @JoinColumn()
  spin: Spin;  
}

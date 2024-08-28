import { Entity, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { BaseModel } from '@root/src/database/base.model';
import { Segment } from '../../spin-segments/entities/segment.entity';
import { SpinTicket } from './spin-ticket.entity';

@Entity()
export class Spin extends BaseModel {

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  spinDate: Date;

  @ManyToOne(() => User, user => user.spins, { onDelete: 'CASCADE' })
  user: User;

  @Column({ default: 0 })
  ticketCount: number; 

  @ManyToOne(() => Segment, { nullable: true })
  @JoinColumn({ name: 'result_id' }) 
  result: Segment;
  

  @OneToOne(() => SpinTicket, ticket => ticket.spin, { nullable: true })
  @JoinColumn()
  ticket: SpinTicket; 
}

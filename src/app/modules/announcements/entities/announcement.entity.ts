import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { BaseModel } from '@root/src/database/base.model';
import { Ticket } from '../../tickets/entities/ticket.entity';
import { User } from '../../users/entities/user.entity';

@Entity('announcements')
export class Announcement  extends BaseModel {
  @Column()
  name: string;

  @Column({ type: 'date' })
  endDate: string;

  @Column({ type: 'text' }) 
  endTime: string;

  @Column({ type: 'int' })
  numberOfTickets: number;

  @OneToMany(() => Ticket, ticket => ticket.announcement, { nullable: true })
  tickets: Ticket[];
  @ManyToOne(() => User, user => user.ticketsCreatedBy, { nullable: false })
  @JoinColumn({ name: 'createdBy' })
  createdBy: User;
  
}

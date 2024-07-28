import { Entity, Column, OneToMany } from 'typeorm';
import { BaseModel } from '@root/src/database/base.model';
import { User } from '../../users/entities/user.entity';
import { Ticket } from '../../tickets/entities/ticket.entity';

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
}

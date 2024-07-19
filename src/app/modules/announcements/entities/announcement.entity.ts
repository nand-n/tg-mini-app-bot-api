import { Entity, Column, OneToMany } from 'typeorm';
import { BaseModel } from '@root/src/database/base.model';
import { User } from '../../users/entities/user.entity';

@Entity('announcements')
export class Announcement  extends BaseModel {
  @Column()
  name: string;

  @Column({ type: 'date' })
  endDate: string;

  @Column({ type: 'time' })
  endTime: string;

  @Column({ type: 'int' })
  numberOfTickets: number;

  @Column({ type: 'int' })
  availableTicketsCount: number;

  @OneToMany(() => User, ticket => ticket.announcment)
  announcment: User[];
}

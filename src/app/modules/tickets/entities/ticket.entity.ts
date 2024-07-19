import { Entity, ManyToOne } from 'typeorm';
import { BaseModel } from '@root/src/database/base.model';
import { Announcement } from '../../announcements/entities/announcement.entity';
import { User } from '../../users/entities/user.entity';

@Entity('tickets')
export class Ticket extends BaseModel {
  @ManyToOne(() => Announcement, announcement => announcement.tickets)
  announcement: Announcement;

  @ManyToOne(() => User, user => user.tickets,  { nullable: true })
  user: User;
}

import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseModel } from '@root/src/database/base.model';
import { Announcement } from '../../announcements/entities/announcement.entity';
import { User } from '../../users/entities/user.entity';
import { IsOptional } from 'class-validator';

@Entity('tickets')
export class Ticket extends BaseModel {
  @ManyToOne(() => Announcement, announcement => announcement.tickets)
  announcement: Announcement;
  @IsOptional()
  @ManyToOne(() => User, user => user.tickets,  { nullable: true })
  player: User;
  
  @Column({ type: 'int'},)
  number: number;
  @IsOptional()
  @Column({ type: 'int' ,nullable:true},)
  payerPhone: number;
  
  @IsOptional()
  @ManyToOne(() => User, user => user.tickets,  { nullable: true })
  createdBy: User;
  
}

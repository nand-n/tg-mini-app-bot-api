import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseModel } from '@root/src/database/base.model';
import { Announcement } from '../../announcements/entities/announcement.entity';
import { User } from '../../users/entities/user.entity';
import { IsOptional } from 'class-validator';
import { Payment } from '../../payment/entities/payment.entity';

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
  @Column({ type: 'bigint' ,nullable:true},)
  payerPhone: number;

  @IsOptional()
  @Column({ type: 'text' ,nullable:true},)
  telegramUser: string;
  
  @Column({ type: 'boolean' , default:false },)
  isPayed: boolean;

  @Column({ type: 'int'},)
  ticketPrice: number;

  
  
  @IsOptional()
  @ManyToOne(() => User, user => user.tickets,  { nullable: true })
  createdBy: User;

  @IsOptional()
  @ManyToOne(() => Payment, payment => payment.ticket,  { nullable: true })
  payment: Payment;
 
  
  
}

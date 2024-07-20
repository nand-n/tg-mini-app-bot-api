import { BaseModel } from '../../../../database/base.model';
import { Entity, Column, OneToMany } from 'typeorm';
import { Ticket } from '../../tickets/entities/ticket.entity';
import { IsOptional } from 'class-validator';
import { Payment } from '../../payment/entities/payment.entity';

@Entity()
export class User extends BaseModel {
  @Column({ length: 500, type: 'varchar' })
  name: string;

  @Column({length:10 , type: 'varchar' , default:'player' , enum:["player" , "admin"]})
  role:string

  @Column({ length: 50, type: 'varchar' })
  phone: string;

  @Column({ length: 50, type: 'varchar' })
  email: string;

  @OneToMany(() => Ticket, (ticket) => ticket.user,  { nullable: true })
  tickets: Ticket[];

  @IsOptional()
  @OneToMany(() => Payment, (payment) => payment.user)
  payments: Payment[];

}

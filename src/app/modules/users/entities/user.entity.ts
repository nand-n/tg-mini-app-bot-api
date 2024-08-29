import { BaseModel } from '../../../../database/base.model';
import { Entity, Column, OneToMany } from 'typeorm';
import { Ticket } from '../../tickets/entities/ticket.entity';
import { IsOptional } from 'class-validator';
import { Payment } from '../../payment/entities/payment.entity';
import { Role } from '../enums/role.enum';
import { Permission, PermissionType } from '../../auth/autherization/permission.type';
import { Spin } from '../../spin/entities/spin.entity';
import { SpinTicket } from '../../spin/entities/spin-ticket.entity';
import { Dice } from '../../dice/entities/dice.entity';

@Entity()
export class User extends BaseModel {
  @Column({ length: 500, type: 'varchar' })
  name: string;
  @Column({ length: 500, type: 'varchar' })
  password: string;

  @Column({ length:50 , type: 'varchar' , enum: Role, default: Role.Regular })
  role: Role;

  @Column({ enum: Permission, default: [], type: "json" })
  permissions: PermissionType[];

  @Column({ length: 50, type: 'varchar' ,nullable:true , unique:true})
  phone: string;

  @Column({ length: 50, type: 'varchar', nullable:true , unique:true })
  email: string;

  @Column({ length: 50, type: 'varchar', nullable:true , unique:true })
  telegramUser: string;

  @OneToMany(() => Ticket, (ticket) => ticket.player,  { nullable: true })
  tickets: Ticket[];
  @OneToMany(() => Ticket, (ticket) => ticket.createdBy,  { nullable: true })
  ticketsCreatedBy: Ticket[];
  @IsOptional()
  @OneToMany(() => Payment, (payment) => payment.user)
  payments: Payment[];

  @OneToMany(() => Spin, spin => spin.user)
  spins: Spin[]

  @OneToMany(() => SpinTicket, spinTicket => spinTicket.user)
  spinTickets: SpinTicket[];

  @Column({ default: 0 })
  diceBalance: number;
  @OneToMany(() => Dice, spinTicket => spinTicket.user)
  dice: Dice[];

}

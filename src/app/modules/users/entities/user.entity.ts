import { BaseModel } from '../../../../database/base.model';
import { Entity, Column, OneToMany } from 'typeorm';
import { Ticket } from '../../tickets/entities/ticket.entity';
import { IsOptional } from 'class-validator';
import { Payment } from '../../payment/entities/payment.entity';
import { Role } from '../enums/role.enum';
import { Permission, PermissionType } from '../../auth/autherization/permission.type';

@Entity()
export class User extends BaseModel {
  @Column({ length: 500, type: 'varchar' })
  name: string;
  @Column({ length: 500, type: 'varchar' })
  password: string;

  // @Column({length:10 , type: 'varchar' , default:'player' , enum:["player" , "admin" , "superadmin"]})
  // role:string

  // @Column({ enum: ["create" , "update" , ""], default: [], type: "json" })
  // permissions: PermissionType[];

  @Column({ enum: Role, default: Role.Regular })
  role: Role;

  @Column({ enum: Permission, default: [], type: "json" })
  permissions: PermissionType[];

  @Column({ length: 50, type: 'varchar' ,nullable:true})
  phone: string;

  @Column({ length: 50, type: 'varchar', nullable:true })
  email: string;

  @Column({ length: 50, type: 'varchar', nullable:true })
  telegramUser: string;

  @OneToMany(() => Ticket, (ticket) => ticket.player,  { nullable: true })
  tickets: Ticket[];
  @OneToMany(() => Ticket, (ticket) => ticket.createdBy,  { nullable: true })
  ticketsCreatedBy: Ticket[];

  @IsOptional()
  @OneToMany(() => Payment, (payment) => payment.user)
  payments: Payment[];

}

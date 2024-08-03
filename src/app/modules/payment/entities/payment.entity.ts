import { IsIn, IsOptional } from "class-validator";
import {
  Entity,
  Column,
  ManyToOne,
} from "typeorm";
import { User } from "../../users/entities/user.entity";
import { BaseModel } from "@root/src/database/base.model";
import { Ticket } from "../../tickets/entities/ticket.entity";

@Entity()
export class Payment extends BaseModel {
  @IsOptional()
  @ManyToOne(() => User, (user) => user.payments)
  user: User;

  @IsOptional()
  @ManyToOne(() => Ticket, (ticket) => ticket.payment)
  ticket: Ticket;
  
  @IsOptional()
  @Column({ nullable: true })
  amount: number;

  @IsOptional()
  @Column({ nullable: true })
  payment_date: Date;

  @IsOptional()
  @Column({ nullable: true })
  payment_method: string;

  @IsOptional()
  @Column({ default: "PENDING" })
  @IsIn(["PENDING", "COMPLETED" , "FAILED"])
  status: string;
  @IsOptional()
  @Column({ nullable: true })
  tx_ref: string;
}

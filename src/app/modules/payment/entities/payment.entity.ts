// Payment.ts
import { IsIn, IsOptional } from "class-validator";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from "typeorm";
import { User } from "../../users/entities/user.entity";
import { BaseModel } from "@root/src/database/base.model";

@Entity()
export class Payment extends BaseModel {
  @IsOptional()
  @ManyToOne(() => User, (user) => user.payments)
  user: User;

  @IsOptional()

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
  @IsIn(["PENDING", "COMPLETED"])
  status: string;
  @IsOptional()
  @Column({ nullable: true })
  tx_ref: string;
}

import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseModel } from '@root/src/database/base.model';
import { Ticket } from '../../tickets/entities/ticket.entity';

@Entity('draws')
export class Draw extends BaseModel {
  @ManyToOne(() => Ticket)
  ticket: Ticket;

  @Column()
  announcementId: string;
}

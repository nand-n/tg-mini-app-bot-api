import { BaseModel } from '@root/src/database/base.model';
import { Entity, Column, OneToMany } from 'typeorm';
import { Spin } from '../../spin/entities/spin.entity';

@Entity('segments')
export class Segment  extends BaseModel {
  @Column()
  segmentText: string;

  @Column()
  segColor: string;

  @Column({ default: 0 })
  selectionCount: number;

  @Column({nullable:true})
  result: string; 
}

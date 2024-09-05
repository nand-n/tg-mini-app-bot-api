import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('keno_games')
export class KenoGame {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('int', { array: true })
  drawnNumbers: number[];

}
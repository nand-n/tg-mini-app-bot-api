import { BaseModel } from '@root/src/database/base.model';
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Balance } from '../../balances/entities/balance.entity';

@Entity()
export class KenoGame extends BaseModel {
    @ManyToOne(() => Balance, { eager: true })
    @JoinColumn({ name: 'balanceId' })
    balance: Balance;
  
    @Column('int', { array: true })
    selectedNumbers: number[];
  
    @Column('int', { array: true, nullable: true })
    drawnNumbers: number[];
  
    @Column({ type: 'int', default: 0 })
    matchedNumbers: number;
  
    @Column({ type: 'decimal', default: 0 })
    betAmount: number;
  
    @Column({ type: 'decimal', default: 0 })
    payoutAmount: number;
  
    @Column({ type: 'boolean', default: false })
    isWinner: boolean;
  
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    playedAt: Date;
}

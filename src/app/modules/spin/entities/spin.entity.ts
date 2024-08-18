// spin.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Spin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  result: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  spinDate: Date;

  @ManyToOne(() => User, user => user.spins, { onDelete: 'CASCADE' })
  user: User;
}

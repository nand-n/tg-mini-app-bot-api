import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KenoGame } from './entities/keno.entity';
import { KenoService } from './keno.service';
import { KenoController } from './keno.controller';
import { BalanceModule } from '../balances/balance.module';
import { Balance } from '../balances/entities/balance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([KenoGame, Balance]), BalanceModule],
  providers: [KenoService],
  controllers: [KenoController],
})
export class KenoModule {}

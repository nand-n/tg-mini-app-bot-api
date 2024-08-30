import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { SegmentService } from '../spin-segments/segment.service';
import { Dice } from './entities/dice.entity';
import { DiceService } from './dice.service';
import { DiceController } from './dice.controller';
import { UsersService } from '../users/users.service';
import { ChapaService } from '../chapa-sdk';
import { PaginationService } from '@root/src/core/pagination/pagination.service';
import { Balance } from '../balances/entities/balance.entity';
import { BalanceService } from '../balances/balance.service';


@Module({
  imports: [TypeOrmModule.forFeature([Dice, User , Balance]) ],
  providers: [DiceService , UsersService, PaginationService , BalanceService] ,
  controllers: [DiceController],
  exports:[DiceService ]
})
export class DiceModule {}
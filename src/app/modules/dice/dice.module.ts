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


@Module({
  imports: [TypeOrmModule.forFeature([Dice, User]) ],
  providers: [DiceService , UsersService, PaginationService] ,
  controllers: [DiceController],
  exports:[DiceService ]
})
export class DiceModule {}
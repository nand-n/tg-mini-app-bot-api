import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Spin } from './entities/spin.entity';
import { User } from '../users/entities/user.entity';
import { SpinTheWheelService } from './spin.service';
import { SpinTheWheelController } from './spin.controller';
import { Segment } from '../spin-segments/entities/segment.entity';
import { SegmentService } from '../spin-segments/segment.service';


@Module({
  imports: [TypeOrmModule.forFeature([Spin, User, Segment])],
  providers: [SpinTheWheelService , SegmentService],
  controllers: [SpinTheWheelController],
  exports:[SpinTheWheelService ]
})
export class SpinTheWheelModule {}
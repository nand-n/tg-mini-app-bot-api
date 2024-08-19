import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SegmentService } from './segment.service';
import { SegmentController } from './segment.controller';
import { Segment } from './entities/segment.entity';
import { Spin } from '../spin/entities/spin.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Segment , Spin , User])],
  controllers: [SegmentController],
  providers: [SegmentService],
  exports:[SegmentService]
})
export class SegmentModule {}

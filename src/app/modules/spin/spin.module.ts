import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Spin } from './entities/spin.entity';
import { User } from '../users/entities/user.entity';
import { SpinTheWheelService } from './spin.service';
import { SpinTheWheelController } from './spin.controller';


@Module({
  imports: [TypeOrmModule.forFeature([Spin, User])],
  providers: [SpinTheWheelService],
  controllers: [SpinTheWheelController],
})
export class SpinTheWheelModule {}
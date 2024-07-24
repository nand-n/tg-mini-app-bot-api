import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Draw } from './entities/draw.entity';
import { Announcement } from '../announcements/entities/announcement.entity';
import { Ticket } from '../tickets/entities/ticket.entity';
import { DrawsService } from './draw.service';
import { DrawsController } from './draw.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Draw, Ticket, Announcement])],
  providers: [DrawsService],
  controllers: [DrawsController],
})
export class DrawsModule {}

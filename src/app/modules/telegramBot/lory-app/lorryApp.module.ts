import { Module } from '@nestjs/common';
import { GreeterUpdate } from './lorryApp.update';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Announcement } from '../../announcements/entities/announcement.entity';
import { AnnouncementsService } from '../../announcements/announcements.service';
import { Ticket } from '../../tickets/entities/ticket.entity';
import { DrawsController } from '../../draw/draw.controller';
import { Draw } from '../../draw/entities/draw.entity';
import { TicketsService } from '../../tickets/tickets.service';
import { DrawsService } from '../../draw/draw.service';
import { User } from '../../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Announcement,Ticket, Draw , User]), // Include all necessary entities here
  ],
  providers: [
    AnnouncementsService, 
    TicketsService, 
    DrawsService,
    GreeterUpdate
  ],
  controllers: [DrawsController],
})
export class GreeterModule {}
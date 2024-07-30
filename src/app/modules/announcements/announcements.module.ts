import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Announcement } from './entities/announcement.entity';
import { AnnouncementsService } from './announcements.service';
import { AnnouncementsController } from './announcements.controller';
import { User } from '../users/entities/user.entity';
import { Ticket } from '../tickets/entities/ticket.entity';
import { TicketsModule } from '../tickets/tickets.module';
import { Draw } from '../draw/entities/draw.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Announcement ,Ticket, User , Draw ]) , TicketsModule ],
  providers: [AnnouncementsService ],
  controllers: [AnnouncementsController],
})
export class AnnouncementsModule {}

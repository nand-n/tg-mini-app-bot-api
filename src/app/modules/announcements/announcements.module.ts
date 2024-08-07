import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Announcement } from './entities/announcement.entity';
import { AnnouncementsService } from './announcements.service';
import { AnnouncementsController } from './announcements.controller';
import { User } from '../users/entities/user.entity';
import { Ticket } from '../tickets/entities/ticket.entity';
import { TicketsModule } from '../tickets/tickets.module';
import { Draw } from '../draw/entities/draw.entity';
import { AuthModule } from '../auth/auth.module';
import jwtConfig from '../auth/config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { PaginationService } from '@root/src/core/pagination/pagination.service';
import { RolesGuardService } from '@root/src/core/middlewares/roleMiddleware';


@Module({
  imports: [TypeOrmModule.forFeature([Announcement ,Ticket, User , Draw ]) , TicketsModule,  forwardRef(() => AuthModule) ,  TicketsModule ,  ConfigModule.forFeature(jwtConfig) ],
  providers: [AnnouncementsService  ,UsersService , PaginationService ],
  controllers: [AnnouncementsController],
  exports:[AnnouncementsService]
})
export class AnnouncementsModule {}

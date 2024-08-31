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
import { PaginationService } from '@root/src/core/pagination/pagination.service';
import { BalanceService } from '../balances/balance.service';
import { Balance } from '../balances/entities/balance.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Announcement ,Ticket, User , Draw , Balance]) , TicketsModule,  forwardRef(() => AuthModule) ,  TicketsModule ,  ConfigModule.forFeature(jwtConfig) ],
  providers: [AnnouncementsService  ,UsersService , PaginationService, BalanceService ],
  controllers: [AnnouncementsController],
  exports:[AnnouncementsService]
})
export class AnnouncementsModule {}

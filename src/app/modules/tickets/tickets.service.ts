import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { Announcement } from '../announcements/entities/announcement.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketsRepository: Repository<Ticket>,
    @InjectRepository(Announcement)
    private readonly announcementsRepository: Repository<Announcement>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

) {}

  async create(createTicketDto: CreateTicketDto) {
    const { announcementId, userId } = createTicketDto;
    const announcement = await this.announcementsRepository.findOne({
        where:{
            id: announcementId
        }
    });
    const user = await this.userRepository.findOne({
        where:{
            id:userId
        }
    })
    if (!announcement) {
      throw new Error('Announcement not found');
    }

    if (announcement.availableTickets <= 0) {
      throw new Error('No tickets available');
    }

    announcement.availableTickets -= 1;
    await this.announcementsRepository.save(announcement);

    const ticket = this.ticketsRepository.create({
        announcement:announcement,
        user:user
    });
    return this.ticketsRepository.save(ticket);
  }

async  findAll() {
    return await this.ticketsRepository.find();
  }

 async findOne(id: string) {
    return await this.ticketsRepository.findOne({
        where:{
            id
        }
    });
  }
}

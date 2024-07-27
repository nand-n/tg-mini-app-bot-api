import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { Announcement } from '../announcements/entities/announcement.entity';
import { User } from '../users/entities/user.entity';
import { AssignTicketDto } from './dto/assign-ticket.dto';

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
    const { announcementId, userId , number } = createTicketDto;
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

    const ticket = this.ticketsRepository.create({
        announcement:announcement,
        player:null,
        number,
        payerPhone:null,
        createdBy: user
    });
    return this.ticketsRepository.save(ticket);
  }

async  findAll() {
    return (await this.ticketsRepository.find({ relations: ['player'] }));
  }

 async findOne(id: string) {
    return await this.ticketsRepository.findOne({
        where:{
            id
        }, 
        relations:['player']
    });
  }

  async findAllTicketsByAnnounmcent(id:string) {
    return await this.ticketsRepository
    .createQueryBuilder('ticket')
    .where('ticket.announcementId = :id' , {id})
    .getMany()
  }

  async assignTicket(id: string, assignTicketDto: AssignTicketDto): Promise<Ticket> {
    const { userId, phoneNumber } = assignTicketDto;

    const ticket = await this.ticketsRepository.findOne({
      where:{
        id
      }
    });
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    if (userId) {
      const user = await this.userRepository.findOne( { 
        where :{ id :userId}});
      if (!user) {
        throw new NotFoundException('User not found');
      }
      ticket.player = user;
    } else if (phoneNumber) {
      ticket.payerPhone = phoneNumber;
    }

    return this.ticketsRepository.save(ticket);
  }
}

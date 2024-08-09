import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { Draw } from './entities/draw.entity';
import { CreateDrawDto } from './dto/create-draw.dto';
import { Announcement } from '../announcements/entities/announcement.entity';
import { Ticket } from '../tickets/entities/ticket.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class DrawsService {
  constructor(
    @InjectRepository(Draw)
    private drawsRepository: Repository<Draw>,
    @InjectRepository(Announcement)
    private announcementsRepository: Repository<Announcement>,
  ) {}

  async createDraw(createDrawDto: CreateDrawDto): Promise<Draw[]> {
    const { announcementId } = createDrawDto;

    const existingDraws = await this.drawsRepository.find({ where: { announcementId } });
    if (existingDraws.length > 0) {
      throw new ConflictException('A draw has already been created for this announcement');
    }
    
    const announcement = await this.announcementsRepository.findOne({
        where:{
          id:  announcementId 
        },
        relations:['tickets']
    },

    );
    if (!announcement) {
      throw new NotFoundException('Announcement not found');
    }

    const tickets = announcement.tickets;
    if (tickets.length === 0) {
      throw new NotFoundException('No tickets found for the announcement');
    }

    const assignedTickets = tickets.filter(ticket => ticket.player || ticket.payerPhone);
    const assignedPercentage = (assignedTickets.length / tickets.length) * 100;
    if (assignedPercentage < 85) {
      throw new BadRequestException(`At least 85% of tickets must be assigned a player or payerPhone. Current percentage: ${assignedPercentage.toFixed(2)}%`);
    }

    const numberOfWinners = Math.ceil(tickets.length / 10);
    const selectedTickets = tickets.sort(() => 0.5 - Math.random()).slice(0, numberOfWinners);

    const draws = selectedTickets.map(ticket => {
      const draw = new Draw();
      draw.ticket = ticket;
      draw.announcementId = announcementId;
      return this.drawsRepository.save(draw);
      
    });

    return Promise.all(draws);
  }

async draw5LuckyNumbers(announcementId: string): Promise<Record<string, { ticketNumber: number, ticketId: string, user: User, telegramUser: string, phoneNumber: number }>> {
  const existingDraws = await this.drawsRepository.find({ where: { announcementId } });
    if (existingDraws.length > 0) {
      throw new ConflictException('A draw has already been created for this announcement');
    }
 
  const announcement = await this.announcementsRepository.findOne({
      where: { id: announcementId },
      relations: ['tickets']
  });

  if (!announcement) {
      throw new NotFoundException('Announcement not found');
  }

  const tickets = announcement.tickets;
  if (tickets.length === 0) {
      throw new NotFoundException('No tickets found for the announcement');
  }

  const assignedTickets = tickets.filter(ticket => ticket.player || ticket.payerPhone);
  const assignedPercentage = (assignedTickets.length / tickets.length) * 100;
  if (assignedPercentage < 85) {
      throw new BadRequestException(`At least 85% of tickets must be assigned a player or payerPhone. Current percentage: ${assignedPercentage.toFixed(2)}%`);
  }

  const numberOfLuckyNumbers = 5;
  const winners: Record<string, { ticketNumber: number, ticketId: string, user: User, telegramUser: string, phoneNumber: number }> = {};

  const winnerLabels = ['1stWinner', '2ndWinner', '3rdWinner', '4thWinner', '5thWinner'];
  const selectedTickets = new Set<string>();

  while (selectedTickets.size < numberOfLuckyNumbers) {
      const randomIndex = Math.floor(Math.random() * assignedTickets.length);
      const selectedTicket = assignedTickets[randomIndex];

      if (!selectedTickets.has(selectedTicket.id)) {
          const winnerLabel = winnerLabels[selectedTickets.size];
          winners[winnerLabel] = {
              ticketNumber: selectedTicket.number,
              ticketId: selectedTicket.id,
              user: selectedTicket.player,
              telegramUser: selectedTicket.telegramUser ,
              phoneNumber: selectedTicket.payerPhone ,
          };
          selectedTickets.add(selectedTicket.id);
      }
  }

  return winners;
}



  async findAllByAnnouncement(announcementId: string): Promise<Draw[]> {
    return this.drawsRepository.find({
        where: { announcementId },
        relations: ['ticket', 'ticket.player'] });
  }

  async findOneByAnnouncement( announcementId: string,id: string ): Promise<Draw> {
    const draw = await this.drawsRepository.findOne({ where: {id , announcementId  } ,  relations: ['ticket', 'ticket.player'] } );
    if (!draw) {
      throw new NotFoundException('Draw not found');
    }
    return draw;
  }

  async findAnnouncementsWithoutDraws(): Promise<Announcement[]> {
    const draws = await this.drawsRepository.find();
    const drawAnnouncementIds = draws.map(draw => draw.announcementId);

    const announcements = await this.announcementsRepository.find({
      where: drawAnnouncementIds.length ? { id: Not(In(drawAnnouncementIds)) } : {},
    });

    return announcements;
  }

  async findAnnouncementsWithDraws(): Promise<Announcement[]> {
    const drawAnnouncementIds = (await this.drawsRepository.find()).map(draw => draw.announcementId);

    if (drawAnnouncementIds.length === 0) {
      throw new NotFoundException('No announcements with draws found');
    }

    const announcements = await this.announcementsRepository.find({
      where: { id: In(drawAnnouncementIds) },
    });

    return announcements;
  }
}

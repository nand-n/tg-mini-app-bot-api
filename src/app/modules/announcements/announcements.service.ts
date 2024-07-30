import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { Announcement } from './entities/announcement.entity';
import { CreateAnnouncementDto } from './dto/announcment.dto';
import { TicketsService } from '../tickets/tickets.service';
import { Draw } from '../draw/entities/draw.entity';


@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectRepository(Announcement)
    private announcementRepository: Repository<Announcement>,
    @InjectRepository(Draw)
    private drawsRepository: Repository<Draw>,
    private ticketsService: TicketsService
  ) {}

  async create(createAnnouncementDto: CreateAnnouncementDto) {
    const announcement = this.announcementRepository.create(createAnnouncementDto);
    const savedAnnouncement = await this.announcementRepository.save(announcement);

    for (let i = 0; i < createAnnouncementDto.numberOfTickets; i++) {
      await this.ticketsService.create({
        announcementId: savedAnnouncement.id,
        number: i+1,
        userId: null,
      });
    }

    return savedAnnouncement;
  }
async findAll() {
    return await this.announcementRepository
    .createQueryBuilder('announcement')
    .leftJoinAndSelect('announcement.tickets', 'ticket')
    .orderBy('ticket.number', 'ASC') 
    .getMany();

  }

  async findAllUnclosedAnnoucment() {
    const draws = await this.drawsRepository.find();
    const drawAnnouncementIds = draws.map(draw => draw.announcementId);

    const announcements = await this.announcementRepository.find({
      where: drawAnnouncementIds.length ? { id: Not(In(drawAnnouncementIds)) } : {},
    });
    return announcements;
  }

  async findAlllosedAAnnoucment() {
    const drawAnnouncementIds = (await this.drawsRepository.find()).map(draw => draw.announcementId);

    if (drawAnnouncementIds.length === 0) {
      throw new NotFoundException('No announcements with draws found');
    }

    const announcements = await this.announcementRepository.find({
      where: { id: In(drawAnnouncementIds) },
    });

    return announcements;
  }

  async findOne(id: string) {
    return await this.announcementRepository
    .createQueryBuilder('announcement')
    .leftJoinAndSelect('announcement.tickets', 'ticket')
    .where('announcement.id = :id', { id })
    .orderBy('ticket.number', 'ASC') 
    .getOne();
  }
}

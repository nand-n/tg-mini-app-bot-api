import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Announcement } from './entities/announcement.entity';
import { CreateAnnouncementDto } from './dto/announcment.dto';
import { TicketsService } from '../tickets/tickets.service';


@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectRepository(Announcement)
    private announcementRepository: Repository<Announcement>,
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
  findAll() {
    return this.announcementRepository.find({
      relations:['tickets']
    });
  }

  findOne(id: string) {
    return this.announcementRepository.findOne({
      where:{
        id
      }
    });
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Announcement } from './entities/announcement.entity';
import { CreateAnnouncementDto } from './dto/announcment.dto';


@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectRepository(Announcement)
    private announcementRepository: Repository<Announcement>,
  ) {}

  async createAnnouncement(dto: CreateAnnouncementDto): Promise<Announcement> {
    const announcement = this.announcementRepository.create(dto);
    return this.announcementRepository.save(announcement);
  }
}

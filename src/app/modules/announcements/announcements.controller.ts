import { Controller, Post, Body } from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto } from './dto/announcment.dto';

@Controller('announcements')
export class AnnouncementsController {
  constructor(private readonly announcementService: AnnouncementsService) {}

  @Post()
  async create(@Body() createAnnouncementDto: CreateAnnouncementDto) {
    return this.announcementService.createAnnouncement(createAnnouncementDto);
  }
}

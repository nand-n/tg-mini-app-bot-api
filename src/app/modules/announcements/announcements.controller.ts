import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto } from './dto/announcment.dto';

@Controller('announcements')
export class AnnouncementsController {
  constructor(private readonly announcementService: AnnouncementsService) {}

  @Post()
  async create(@Body() createAnnouncementDto: CreateAnnouncementDto) {
    return this.announcementService.create(createAnnouncementDto);
  }
  @Get()
  async findAll() {
    return this.announcementService.findAll();
  }

  @Get('open')
  async findAllUnclosedAnnoucment(){
    return this.announcementService.findAllUnclosedAnnoucment()
  }
  @Get('closed')
  async findAlllosedAAnnoucment(){
    return this.announcementService.findAlllosedAAnnoucment()
  }
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.announcementService.findOne(id);
  }
}

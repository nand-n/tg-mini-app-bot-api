import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CreateDrawDto } from './dto/create-draw.dto';
import { Draw } from './entities/draw.entity';
import { DrawsService } from './draw.service';

@Controller('draws')
export class DrawsController {
  constructor(private readonly drawsService: DrawsService) {}

  @Post()
  createDraw(@Body() createDrawDto: CreateDrawDto): Promise<Draw[]> {
    return this.drawsService.createDraw(createDrawDto);
  }
  @Get('announcement/:announcementId')
  findAllByAnnouncement(@Param('announcementId') announcementId: string): Promise<Draw[]> {
    return this.drawsService.findAllByAnnouncement(announcementId);
  }

  @Get('announcement/:announcementId/:id')
  findOneByAnnouncement(
    @Param('announcementId') announcementId: string,
    @Param('id') id: string,
  ): Promise<Draw> {
    return this.drawsService.findOneByAnnouncement(announcementId, id);
  }
}

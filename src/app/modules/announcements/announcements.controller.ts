import { Controller, Post, Body, Get, Param, UseGuards, Req } from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto } from './dto/announcment.dto';
import { Roles } from '../auth/autherization/decorators/role.decorator';
import { Role } from '../users/enums/role.enum';
import { RolesGuard } from '../auth/autherization/guards/roles.guard';
import { REQUEST_USER } from '../auth/auth.constants';
import { User } from '../users/entities/user.entity';

@Controller('announcements')
export class AnnouncementsController {
  constructor(private readonly announcementService: AnnouncementsService) {}

  @Post()
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)

  async create(@Body() createAnnouncementDto: CreateAnnouncementDto,  @Req() req: Request,) {
    const currentUser = req[REQUEST_USER] as User;
    return this.announcementService.create(createAnnouncementDto , currentUser);
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

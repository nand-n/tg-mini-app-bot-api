import { Controller, Post, Body, Get, Patch, Param } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { TicketsService } from './tickets.service';
import { Ticket } from './entities/ticket.entity';
import { AssignTicketDto } from './dto/assign-ticket.dto';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  create(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketsService.create(createTicketDto);
  }
  @Get()
  findAll() {
    return this.ticketsService.findAll();
  }
  @Get(':id')
  findOne(
    @Param('id') id:string,
  ) {
    return this.ticketsService.findOne(id);
  }
  @Post('/my-tickets')
  async findMyTickets(
    @Body() myTickets: AssignTicketDto,
  ) {
    return this.ticketsService.findAllMyTickets(myTickets);
  }

  @Get('/announcment/:id')
  findAllTicketsByAnnouncmentId(
    @Param('id') id:string,
  ) {
    return this.ticketsService.findAllTicketsByAnnounmcent(id);
  }
  @Patch(':id/assign')
  assignTicket(
    @Param('id') id: string,
    @Body() assignTicketDto: AssignTicketDto,
  ): Promise<Ticket> {
    return this.ticketsService.assignTicket(id, assignTicketDto);
  }

  @Patch('/payed/:id')
  updateIsPayed(
    @Param('id') id: string,
  ): Promise<Ticket> {
    return this.ticketsService.updateIsPayed(id,);
  }
}

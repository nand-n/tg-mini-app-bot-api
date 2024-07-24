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
  @Patch(':id/assign')
  assignTicket(
    @Param('id') id: string,
    @Body() assignTicketDto: AssignTicketDto,
  ): Promise<Ticket> {
    return this.ticketsService.assignTicket(id, assignTicketDto);
  }
}

import { Controller, Post, Get, Param, Body, NotFoundException } from '@nestjs/common';
import { SpinTheWheelService } from './spin.service';
import { CreateSpinDto } from './dto/create-spin.dto';
import { SpinTicket } from './entities/spin-ticket.entity';

@Controller('spin-the-wheel')
export class SpinTheWheelController {
  constructor(private readonly spinTheWheelService: SpinTheWheelService) {}

  @Post('spin')
  createSpin(
    @Body() createSpinDto: CreateSpinDto
  ) {
    const { userId } = createSpinDto;
    return this.spinTheWheelService.createSpin(userId);
  }
  @Post('tickets/buy')
  buySpinTickets(
    @Body() buyTicketsDto: {  numberOfTickets: number }
  ) {
    const { numberOfTickets } = buyTicketsDto;
    return this.spinTheWheelService.buySpinTickets(numberOfTickets);
  }
  
  
  @Post('verify-and-issue-tickets/:userId')
  async verifyAndIssueTickets(
    @Param('userId') userId: string,
    @Body('tx_ref') txRef: string
  ): Promise<{ message: string; tickets: SpinTicket[] }> {
    try {
      const tickets = await this.spinTheWheelService.verifyAndIssueTickets(userId, txRef);
      return {
        message: 'Payment verified successfully and tickets issued.',
        tickets,
      };
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }


}

import { Controller, Post, Body, Param, ParseIntPipe, Get } from '@nestjs/common';
import { DiceService } from './dice.service';
import { CreateDiceDto } from './dto/create-dice.dto';

@Controller('dice')
export class DiceController {
  constructor(private readonly diceService: DiceService) {}
  @Post('play')
  async playDice(@Body() createDiceDto: CreateDiceDto) {
    return await this.diceService.playDice(createDiceDto);
  }
  @Post('recharge/:userId/:amount')
  async rechargeBalance(
    @Param('userId') userId: string,
    @Param('amount') amount: number
  ) {
    return  await this.diceService.rechargeBalance(userId, amount);
  }

  @Get('balance/:id')
  async getBalance(
    @Param('id') userId: string,
  ) {
    await this.diceService.getBalance(userId);
    return { message: 'Balance recharged successfully' };
  }

  @Post(':id/verify-recharge')
  async verifyAndRechargeBalance(
    @Param('id') userId: string,
    @Body('txRef') txRef: string,
  ): Promise<{ message: string; balance: number }> {
    const user = await this.diceService.verifyAndRechargeBalance(userId, txRef);
    return {
      message: 'Balance recharged successfully.',
      balance: user.diceBalance,
    };
  }
}

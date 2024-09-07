import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { KenoService } from './keno.service';
import { PlayKenoGameDto } from './dto/play-keno-game.dto';

@Controller('keno')
export class KenoController {
  constructor(private readonly kenoService: KenoService) {}

  @Post(':userId/play')
  async playKenoGame(
    @Param('userId') userId: string,
    @Body() playKenoGameDto: PlayKenoGameDto
  ) {
    const { selectedNumbers, betAmount } = playKenoGameDto;
    return this.kenoService.playKenoGame(userId, selectedNumbers, betAmount);
  }

  @Get(':userId/games')
  async getUserKenoGames(@Param('userId') userId: string) {
    return this.kenoService.getUserKenoGames(userId);
  }
  @Get('balance/:userId')
  async getUserBalance(@Param('userId') userId: string) {
    return this.kenoService.getUserBalance(userId);
    
  }
}

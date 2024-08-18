import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { SpinTheWheelService } from './spin.service';

@Controller('spin-the-wheel')
export class SpinTheWheelController {
  constructor(private readonly spinTheWheelService: SpinTheWheelService) {}

  @Post('spin/:userId')
  createSpin(
    @Param('userId') userId: string,
    @Body('result') result: string,
  ) {
    return this.spinTheWheelService.createSpin(userId, result);
  }

  @Get('user/:userId/spins')
  getUserSpins(@Param('userId') userId: string) {
    return this.spinTheWheelService.getUserSpins(userId);
  }

  @Get('spins')
  getAllSpins() {
    return this.spinTheWheelService.getAllSpins();
  }
}

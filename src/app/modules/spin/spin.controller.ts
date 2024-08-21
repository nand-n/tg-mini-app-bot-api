import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { SpinTheWheelService } from './spin.service';
import { CreateSpinDto } from './dto/create-spin.dto';

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
}

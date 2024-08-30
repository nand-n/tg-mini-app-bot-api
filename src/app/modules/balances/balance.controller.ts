import { Controller, Post, Get, Put, Delete, Body, Param } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { CreateBalanceDto } from './dto/create-balance.dto';
import { UpdateBalanceDto } from './dto/update-balance.dto';

@Controller('balances')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Post(':userId')
  async createBalance(
    @Param('userId') userId: string,
    @Body() createBalanceDto: CreateBalanceDto,
  ) {
    return this.balanceService.createBalance(userId, createBalanceDto);
  }

  @Get(':userId')
  async getBalance(@Param('userId') userId: string) {
    return this.balanceService.getBalance(userId);
  }

  @Put(':userId')
  async updateBalance(
    @Param('userId') userId: string,
    @Body() updateBalanceDto: UpdateBalanceDto,
  ) {
    return this.balanceService.updateBalance(userId, updateBalanceDto);
  }

  @Delete(':userId')
  async deleteBalance(@Param('userId') userId: string) {
    return this.balanceService.deleteBalance(userId);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Balance } from './entities/balance.entity';
import { CreateBalanceDto } from './dto/create-balance.dto';
import { UpdateBalanceDto } from './dto/update-balance.dto';

@Injectable()
export class BalanceService {
  constructor(
    @InjectRepository(Balance)
    private balanceRepository: Repository<Balance>,
  ) {}

  async createBalance(userId: string, createBalanceDto?: CreateBalanceDto): Promise<Balance> {
    const balance = this.balanceRepository.create({ ...createBalanceDto, user: { id: userId } });
    return await this.balanceRepository.save(balance);
  }

  async getBalance(userId: string): Promise<Balance> {
    const balance = await this.balanceRepository.findOne({ where: { user:{id:userId} } });
    return balance;
  }

  async updateBalance(userId: string, updateBalanceDto: UpdateBalanceDto): Promise<Balance> {
    const balance = await this.getBalance(userId);
    Object.assign(balance, updateBalanceDto);
    return await this.balanceRepository.save(balance);
  }

  async deleteBalance(userId: string): Promise<void> {
    const balance = await this.getBalance(userId);
    await this.balanceRepository.remove(balance);
  }
}


import { Injectable, NotFoundException, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDiceDto } from './dto/create-dice.dto';
import { Dice } from './entities/dice.entity';
import { UsersService } from '../users/users.service';
import { ChapaService, InitializeOptions, VerifyOptions, VerifyResponse } from '../chapa-sdk';
import { User } from '../users/entities/user.entity';
import { BalanceService } from '../balances/balance.service';

@Injectable()
export class DiceService {
  constructor(
    @InjectRepository(Dice)
    private readonly diceRepository: Repository<Dice>,
    private readonly userService: UsersService,
    private readonly chapaService: ChapaService,
    private readonly balanceService: BalanceService,
  ) {}

  async playDice(createDiceDto: CreateDiceDto): Promise<Dice> {
    const { userId, betAmount, dicePositions } = createDiceDto;

    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const balance = await this.balanceService.getBalance(userId);
    if (balance.diceBalance < betAmount) { 
      throw new BadRequestException('Insufficient balance to place bet');
    }
    const outcome = this.rollDice(dicePositions);

    let updatedBalance = balance.diceBalance;
    if (outcome.isWin) {
      updatedBalance += outcome.winnings;
    } else {
      updatedBalance -= betAmount;
    }

    await this.balanceService.updateBalance(userId, { diceBalance: updatedBalance }); // Use BalanceService to update balance
    const diceGame = this.diceRepository.create({
      dicePlayTime: new Date(),
      diceBalance: updatedBalance,
      user: user,
    });

    return await this.diceRepository.save(diceGame);
  }

  async rechargeBalance(userId: string, amount: number): Promise<{ message: string; paymentLink: string; txRef: string }> {
    console.log(userId, amount);
    const user = await this.userService.findOne(userId);
    const txRef = `recharge_${userId}_${Date.now()}`;

    const initializeOptions: InitializeOptions = {
      first_name: user.name,
      last_name: user.name+ Date.now(),
      amount: `${amount}`,
      currency: 'ETB',
      tx_ref: txRef,
      phone_number: user.phone, 
    };

    try {
      const { checkout_url } = await this.chapaService.initialize(initializeOptions);
      return {
        message: 'Please complete your payment by clicking the button below.',
        paymentLink: checkout_url,
        txRef,
      };
    } catch (error) {
      console.error('Error during payment initialization:', error);
      throw new HttpException('Error initializing payment. Please try again later.', HttpStatus.FORBIDDEN);
    }
  }

  async verifyAndRechargeBalance(userId: string, txRef: string): Promise<User> {
    const verifyOptions: VerifyOptions = { tx_ref: txRef };

    try {
      const verificationResponse: VerifyResponse = await this.chapaService.verify(verifyOptions);

      if (verificationResponse.data.status === 'success') {
        const rechargeAmount = parseFloat(verificationResponse.data.amount);
      const existingBalance = await this.balanceService.getBalance(userId);
      if (existingBalance) {
        await this.balanceService.updateBalance(userId, { diceBalance: existingBalance.diceBalance + rechargeAmount });
      } else {
        await this.balanceService.createBalance(userId, {
          diceBalance: rechargeAmount
        });
      }

        const user = await this.userService.findOne(userId);
        return user;
      } else {
        throw new HttpException('Payment verification failed or payment not successful.', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      console.error('Error during payment verification:', error);
      throw new HttpException('Error verifying payment. Please try again later.', HttpStatus.FORBIDDEN);
    }
  }


  async getBalance(userId: string): Promise<{ balance: number }> {
    const balance = await this.balanceService.getBalance(userId);
    return { balance: balance.diceBalance };
  }

  private rollDice(dicePositions: number[]): { isWin: boolean, winnings: number } {
    const rolledDice = Math.floor(Math.random() * 6) + 1;
    const isWin = dicePositions.includes(rolledDice);
    const winnings = isWin ? dicePositions.length * 10 : 0;
    return { isWin, winnings };
  }
}

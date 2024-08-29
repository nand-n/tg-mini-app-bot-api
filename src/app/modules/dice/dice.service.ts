import { Injectable, NotFoundException, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDiceDto } from './dto/create-dice.dto';
import { Dice } from './entities/dice.entity';
import { UsersService } from '../users/users.service';
import { ChapaService, InitializeOptions, VerifyOptions, VerifyResponse } from '../chapa-sdk';
import { User } from '../users/entities/user.entity';


@Injectable()
export class DiceService {
  constructor(
    @InjectRepository(Dice)
    private readonly diceRepository: Repository<Dice>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UsersService,
    private readonly chapaService: ChapaService,
  ) {}

  async playDice(createDiceDto: CreateDiceDto): Promise<Dice> {
    const { userId, betAmount, dicePositions } = createDiceDto;

    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    if (user.diceBalance < betAmount) {
      throw new BadRequestException('Insufficient balance to place bet');
    }

    const outcome = this.rollDice(dicePositions);

    let updatedBalance = user.diceBalance;
    if (outcome.isWin) {
      updatedBalance += outcome.winnings;
    } else {
      updatedBalance -= betAmount;
    }

    await this.userService.updateBalance(userId, updatedBalance);

    const diceGame = this.diceRepository.create({
      dicePlayTime: new Date(),
      diceBalance: updatedBalance,
      user: user,
    });

    return await this.diceRepository.save(diceGame);
  }


  async rechargeBalance(userId: string, amount: number): Promise<{ message: string; paymentLink: string; txRef: string }> {
    const user = await this.userService.findOne(userId);
    
    const txRef = `recharge_${userId}_${Date.now()}`;

    const initializeOptions: InitializeOptions = {
      first_name: user.name,
      last_name:user.name,
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
        const user = await this.userService.findOne(userId);

        const rechargeAmount = parseFloat(verificationResponse.data.amount);

        user.diceBalance += rechargeAmount;

        return await this.userRepository.save(user);
      } else {
        throw new HttpException('Payment verification failed or payment not successful.', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      console.error('Error during payment verification:', error);
      throw new HttpException('Error verifying payment. Please try again later.', HttpStatus.FORBIDDEN);
    }
  }

  async getBalance(userId: string): Promise<number> {
    const dice = await this.diceRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!dice) {
      throw new NotFoundException('User or Dice record not found');
    }

    return dice.diceBalance;
  }
  private rollDice(dicePositions: number[]): { isWin: boolean, winnings: number } {
    const rolledDice = Math.floor(Math.random() * 6) + 1;
    const isWin = dicePositions.includes(rolledDice);
    const winnings = isWin ? dicePositions.length * 10 : 0;
    return { isWin, winnings };
  }
}

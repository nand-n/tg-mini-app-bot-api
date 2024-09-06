// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { KenoGame } from './entities/keno.entity';
// import { BalanceService } from '../balances/balance.service';

// @Injectable()
// export class KenoService {
//   constructor(
//     @InjectRepository(KenoGame)
//     private kenoGameRepository: Repository<KenoGame>,
//     private balanceService: BalanceService,
//   ) {}

//   private drawNumbers(): number[] {
//     const drawnNumbers: number[] = [];
//     while (drawnNumbers.length < 20) {
//       const rand = Math.floor(Math.random() * 80) + 1;
//       if (!drawnNumbers.includes(rand)) {
//         drawnNumbers.push(rand);
//       }
//     }
//     return drawnNumbers;
//   }

//   private calculatePayout(selectedNumbers: number[], drawnNumbers: number[]): { matched: number, payout: number } {
//     const matchedNumbers = selectedNumbers.filter((num) => drawnNumbers.includes(num)).length;

//     // Example payout logic, adjust based on your rules
//     let payout = 0;
//     if (matchedNumbers >= 5) {
//       payout = matchedNumbers * 2; // Basic multiplier logic
//     }

//     return { matched: matchedNumbers, payout };
//   }

//   async playKenoGame(userId: string, selectedNumbers: number[], betAmount: number): Promise<KenoGame> {
//  try {
//     const balance = await this.balanceService.getBalance(userId);
//     if(!balance){
//         throw new Error("Balance not found")
//     }
//     console.log(balance);
//     if (balance.kenoBalance < betAmount) {
//       throw new Error('Insufficient balance');
//     }

//     // Deduct the bet from the user's balance
//     balance.kenoBalance -= betAmount;
//     await this.balanceService.updateBalance(userId, { kenoBalance: balance.kenoBalance });

//     const drawnNumbers = this.drawNumbers();
//     const { matched, payout } = this.calculatePayout(selectedNumbers, drawnNumbers);

//     // Create the KenoGame record
//     const kenoGame = this.kenoGameRepository.create({
//       selectedNumbers,
//       drawnNumbers,
//       matchedNumbers: matched,
//       betAmount,
//       payoutAmount: payout,
//       isWinner: payout > 0,
//       balance,
//     });

//     await this.kenoGameRepository.save(kenoGame);

//     // Update balance with the payout
//     if (payout > 0) {
//       balance.kenoBalance += payout;
//       await this.balanceService.updateBalance(userId, { kenoBalance: balance.kenoBalance });
//     }

//     return kenoGame;
//  } catch (error) {
//     console.log(error);
//     throw error
//  }
//   }

//   async getUserKenoGames(userId: string): Promise<KenoGame[]> {
//     const balance = await this.balanceService.getBalance(userId);
//     return this.kenoGameRepository.find({ where: { balance } });
//   }
// }


import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KenoGame } from './entities/keno.entity';
import { BalanceService } from '../balances/balance.service';

@Injectable()
export class KenoService {
  constructor(
    @InjectRepository(KenoGame)
    private kenoGameRepository: Repository<KenoGame>,
    private balanceService: BalanceService,
  ) {}

  private drawNumbers(): number[] {
    const drawnNumbers: number[] = [];
    while (drawnNumbers.length < 20) {
      const rand = Math.floor(Math.random() * 80) + 1;
      if (!drawnNumbers.includes(rand)) {
        drawnNumbers.push(rand);
      }
    }
    return drawnNumbers;
  }

  private calculatePayout(selectedNumbers: number[], drawnNumbers: number[], betAmount: number): { matched: number, payout: number } {
    const matchedNumbers = selectedNumbers.filter((num) => drawnNumbers.includes(num)).length;

    // const odds = {
    //     2: 1,   // 1x bet amount (break-even)
    //     3: 2,   // 2x bet amount
    //     4: 4,   // 4x bet amount
    //     5: 10,  // 10x bet amount
    //   };
    const odds = {
        2: 0,   // No net gain (break-even)
        3: 2,   // 2x bet amount
        4: 4,   // 4x bet amount
        5: 10,  // 10x bet amount
      };
    
      // Calculate payout based on odds
      const payout = odds[matchedNumbers] ? betAmount * odds[matchedNumbers] : 0;
    return { matched: matchedNumbers, payout };
  }

  async playKenoGame(userId: string, selectedNumbers: number[], betAmount: number): Promise<KenoGame> {
    try {
      // Get user balance
      const balance = await this.balanceService.getBalance(userId);
      if (!balance) {
        throw new NotFoundException(`Balance for user ${userId} not found`);
      }

      // Check if user has enough balance to bet
      if (balance.kenoBalance < betAmount) {
        throw new BadRequestException(`Insufficient balance. Your current balance is ${balance.kenoBalance}`);
      }

      // Deduct the bet from the user's balance
      balance.kenoBalance -= betAmount;
      await this.balanceService.updateBalance(userId, { kenoBalance: balance.kenoBalance });

      const drawnNumbers = this.drawNumbers();
      const { matched, payout } = this.calculatePayout(selectedNumbers, drawnNumbers,  betAmount);

      // Create the KenoGame record
      const kenoGame = this.kenoGameRepository.create({
        selectedNumbers,
        drawnNumbers,
        matchedNumbers: matched,
        betAmount,
        payoutAmount: payout,
        isWinner: payout > 0,
        balance,
      });

      await this.kenoGameRepository.save(kenoGame);

      // Update balance with the payout
      if (payout > 0) {
        balance.kenoBalance += payout;
        await this.balanceService.updateBalance(userId, { kenoBalance: balance.kenoBalance });
      }

      return kenoGame;

    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('An unexpected error occurred while playing the Keno game');
    }
  }

  async getUserKenoGames(userId: string): Promise<KenoGame[]> {
    const balance = await this.balanceService.getBalance(userId);
    if (!balance) {
      throw new NotFoundException(`Balance for user ${userId} not found`);
    }
    
    return this.kenoGameRepository.find({ where: { balance } });
  }
}

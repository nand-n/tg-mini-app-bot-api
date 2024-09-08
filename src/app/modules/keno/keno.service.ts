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

//   private calculatePayout(selectedNumbers: number[], drawnNumbers: number[], betAmount: number): { matched: number, payout: number } {
//     const matchedNumbers = selectedNumbers.filter((num) => drawnNumbers.includes(num)).length;

//     // const odds = {
//     //     2: 1,   // 1x bet amount (break-even)
//     //     3: 2,   // 2x bet amount
//     //     4: 4,   // 4x bet amount
//     //     5: 10,  // 10x bet amount
//     //   };
//     const odds = {
//         2: 0,   // No net gain (break-even)
//         3: 2,   // 2x bet amount
//         4: 4,   // 4x bet amount
//         5: 10,  // 10x bet amount
//       };
    
//       // Calculate payout based on odds
//       const payout = odds[matchedNumbers] ? betAmount * odds[matchedNumbers] : 0;
//     return { matched: matchedNumbers, payout };
//   }

//   async playKenoGame(userId: string, selectedNumbers: number[], betAmount: number): Promise<KenoGame> {
//     try {
//       // Get user balance
//       const balance = await this.balanceService.getBalance(userId);
//       if (!balance) {
//         throw new NotFoundException(`Balance for user ${userId} not found`);
//       }

//       // Check if user has enough balance to bet
//       if (balance.kenoBalance < betAmount) {
//         throw new BadRequestException(`Insufficient balance. Your current balance is ${balance.kenoBalance}`);
//       }

//       // Deduct the bet from the user's balance
//       balance.kenoBalance -= betAmount;
//       await this.balanceService.updateBalance(userId, { kenoBalance: balance.kenoBalance });

//       const drawnNumbers = this.drawNumbers();
//       const { matched, payout } = this.calculatePayout(selectedNumbers, drawnNumbers,  betAmount);

//       // Create the KenoGame record
//       const kenoGame = this.kenoGameRepository.create({
//         selectedNumbers,
//         drawnNumbers,
//         matchedNumbers: matched,
//         betAmount,
//         payoutAmount: payout,
//         isWinner: payout > 0,
//         balance,
//       });

//       await this.kenoGameRepository.save(kenoGame);

//       // Update balance with the payout
//       if (payout > 0) {
//         balance.kenoBalance += payout;
//         await this.balanceService.updateBalance(userId, { kenoBalance: balance.kenoBalance });
//       }

//       return kenoGame;

//     } catch (error) {
//       if (error instanceof NotFoundException || error instanceof BadRequestException) {
//         throw error;
//       }
//       throw new BadRequestException('An unexpected error occurred while playing the Keno game');
//     }
//   }

//   async getUserKenoGames(userId: string): Promise<KenoGame[]> {
//     const balance = await this.balanceService.getBalance(userId);
//     if (!balance) {
//       throw new NotFoundException(`Balance for user ${userId} not found`);
//     }
    
//     return this.kenoGameRepository.find({ where: { balance } });
//   }
// }


@Injectable()
export class KenoService {
  constructor(
    @InjectRepository(KenoGame)
    private kenoGameRepository: Repository<KenoGame>,
    private balanceService: BalanceService,
  ) {}

  // Basic random draw for Keno numbers
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

  // Payout logic based on matching numbers
  private calculatePayout(selectedNumbers: number[], drawnNumbers: number[], betAmount: number): { matched: number, payout: number } {
    const matchedNumbers = selectedNumbers.filter((num) => drawnNumbers.includes(num)).length;

    const odds = {
      2: 0,   // No net gain (break-even)
      3: 4,   // 2x bet amount
      4: 5,   // 4x bet amount
      5: 10,  // 10x bet amount
    };

    
    const payout = odds[matchedNumbers] ? betAmount * odds[matchedNumbers] : 0;
    return { matched: matchedNumbers, payout };
  }

  
  // AI decides whether the user wins based on behavior and previous game history
  // private aiDecidesWin(userHistory: KenoGame[], selectedNumbers: number[], betAmount: number): { shouldWin: boolean, adjustedDrawnNumbers: number[] } {
  //   // Analyze user history
  //   const recentLosses = userHistory.filter(game => !game.isWinner).length;
  //   const recentWins = userHistory.filter(game => game.isWinner).length;

  //   // Set win/loss strategy: 
  //   const shouldWin = (recentLosses >= 3 || Math.random() < 0.2); // Win after 3 losses or random chance

  //   // If AI decides user should win, adjust drawn numbers to ensure a win
  //   let drawnNumbers = this.drawNumbers();
  //   if (shouldWin) {
  //     const guaranteedWinNumbers = selectedNumbers.slice(0, Math.min(3, selectedNumbers.length)); // Guarantee at least 3 matches
  //     drawnNumbers = [...guaranteedWinNumbers, ...drawnNumbers.slice(guaranteedWinNumbers.length)];
  //   }
    
  //   return { shouldWin, adjustedDrawnNumbers: drawnNumbers };
  // }

  private aiDecidesWin(userHistory: KenoGame[], selectedNumbers: number[], betAmount: number): { shouldWin: boolean, adjustedDrawnNumbers: number[] } {
    const totalGames = userHistory.length;
    
    // Filter recent 10 games (or fewer if history is shorter)
    const recentGames = userHistory.slice(-10);
    const recentLosses = recentGames.filter(game => !game.isWinner).length;
    const recentWins = recentGames.filter(game => game.isWinner).length;
  
    // Adjust win strategy based on recent patterns
    let shouldWin = false;
    // Strategy logic:
    // 1. If the user lost 3+ times in a row, ensure a win (reset after win).
    // 2. If user won recently (1-2 games), don't let them win again too soon.
    // 3. Use a small chance (like 10-20%) to win if neither of the above applies.
    if (recentLosses >= 6 && recentWins == 0) {
      shouldWin = true; // Win after 3 losses in a row
    } else if (recentWins > 0 && recentWins / totalGames > 0.1) { 
      shouldWin = false; // Limit too frequent wins (don't allow more than 30% win rate)
    } else {
      shouldWin = Math.random() < 0.15; // Small chance to win (15%)
    }
  
    // Draw numbers, and adjust for guaranteed win if needed
    let drawnNumbers = this.drawNumbers();
    if (shouldWin) {
      const guaranteedWinNumbers = selectedNumbers.slice(0, Math.min(3, selectedNumbers.length)); // Ensure some matches
      drawnNumbers = [...guaranteedWinNumbers, ...drawnNumbers.slice(guaranteedWinNumbers.length)];
    }
  
    return { shouldWin, adjustedDrawnNumbers: drawnNumbers };
  }
  
  async playKenoGame(userId: string, selectedNumbers: number[], betAmount: number): Promise<KenoGame> {
    try {
      const balance = await this.balanceService.getBalance(userId);
      if (!balance) {
        throw new NotFoundException(`Balance for user ${userId} not found`);
      }

      if (balance.kenoBalance < betAmount) {
        throw new BadRequestException(`Insufficient balance. Your current balance is ${balance.kenoBalance}`);
      }

      // Deduct bet amount
      balance.kenoBalance -= betAmount;
      await this.balanceService.updateBalance(userId, { kenoBalance: balance.kenoBalance });

      // Fetch user history
      const userKenoHistory = await this.getUserKenoGames(userId);

      // AI decides if the user should win
      const { shouldWin, adjustedDrawnNumbers } = this.aiDecidesWin(userKenoHistory, selectedNumbers, betAmount);

      // Calculate payout based on AI-determined drawn numbers
      const { matched, payout } = this.calculatePayout(selectedNumbers, adjustedDrawnNumbers, betAmount);

      const kenoGame = this.kenoGameRepository.create({
        selectedNumbers,
        drawnNumbers: adjustedDrawnNumbers,
        matchedNumbers: matched,
        betAmount,
        payoutAmount: payout,
        isWinner: shouldWin,
        balance,
      });

      await this.kenoGameRepository.save(kenoGame);

      // Update balance if user wins
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
    const keno = await this.kenoGameRepository.find({ where: { balance:{id:balance.id} } })

    return keno;
  }

  async getUserBalance(userId: string): Promise<Object> {
    const balance = await this.balanceService.getBalance(userId);
    
    if (!balance) {
      throw new NotFoundException(`Balance for user ${userId} not found`);
    }
  
    return balance; 
  }
  
}

import { IsNumber, IsOptional } from 'class-validator';

export class CreateBalanceDto {
  @IsOptional()
  @IsNumber()
  diceBalance: number;
  @IsOptional()
  @IsNumber()
  kenoBalance: number;
  @IsOptional()
  @IsNumber()
  bingoBalance: number;
}

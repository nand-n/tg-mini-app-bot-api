import { IsNumber, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateDiceDto {
  @IsNumber()
  userId: string;

  @IsNumber()
  betAmount: number;

  @IsArray()
  @ArrayNotEmpty()
  dicePositions: number[];
}

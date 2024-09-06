import { IsArray, ArrayNotEmpty, ArrayMinSize, ArrayMaxSize, IsNumber, Min } from 'class-validator';

export class PlayKenoGameDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  selectedNumbers: number[];

  @IsNumber()
  @Min(1)
  betAmount: number;
}

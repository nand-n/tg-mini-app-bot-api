import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateEqubPaymentDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  equbId: string;

}

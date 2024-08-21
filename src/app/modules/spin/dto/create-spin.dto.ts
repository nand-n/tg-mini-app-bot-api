import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSpinDto {
  @IsNotEmpty()
  @IsString()
  userId: string;
}

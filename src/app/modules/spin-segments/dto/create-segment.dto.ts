import { IsNotEmpty, IsString, IsHexColor } from 'class-validator';

export class CreateSegmentDto {
  @IsString()
  @IsNotEmpty()
  segmentText: string;

  @IsHexColor()
  @IsNotEmpty()
  segColor: string;
}

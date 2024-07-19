import { IsString, IsInt, IsDateString,  } from 'class-validator';

export class CreateAnnouncementDto {
  @IsString()
  name: string;

  @IsDateString()
  endDate: string;

  @IsString()
  endTime: string;

  @IsInt()
  numberOfTickets: number

  @IsInt()
  availableTickets: number;
}

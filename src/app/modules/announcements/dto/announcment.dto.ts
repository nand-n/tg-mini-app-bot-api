// import { Transform } from 'class-transformer';
import { IsString, IsInt, IsDateString,  } from 'class-validator';
// import dayjs from 'dayjs';

export class CreateAnnouncementDto {
  @IsString()
  name: string;

  @IsDateString()
  endDate: string;

  @IsString()
  // @Transform(({ value }) => dayjs(value).format('HH:mm:ss'), { toClassOnly: true })
  endTime: string;

  @IsInt()
  numberOfTickets: number

  @IsInt()
  ticketPrice: number
}

import { IsString } from 'class-validator';

export class CreateDrawDto {
  @IsString()
  announcementId: string;
}

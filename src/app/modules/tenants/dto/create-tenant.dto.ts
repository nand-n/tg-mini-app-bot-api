import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTenantDto {
  @IsNotEmpty()
  @IsString()
  tenantName: string;

  @IsNotEmpty()
  @IsString()
  schemaName: string;

  @IsNotEmpty()
  @IsString()
  botToken: string;
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantService } from './tenant.service';
import { TenantController } from './tenant.controller';
import { Tenant } from './entities/tenants.entity';
import { Connection } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant])],
  controllers: [TenantController],
  providers: [TenantService,  {
    provide: 'TENANT_CONNECTION',
    useFactory: (connection: Connection) => connection,
    inject: [Connection],
  },],
  exports:[TenantService, 'TENANT_CONNECTION']
})
export class TenantModule {}

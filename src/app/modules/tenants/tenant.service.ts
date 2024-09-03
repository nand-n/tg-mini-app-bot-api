import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';

import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { Tenant } from './entities/tenants.entity';

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
    private connection: Connection,
  ) {}

  create(createTenantDto: CreateTenantDto) {
    const tenant = this.tenantRepository.create(createTenantDto);
    return this.tenantRepository.save(tenant);
  }

  async registerTenant(createTenantDto: CreateTenantDto) {
    const schemaName = `tenant_${createTenantDto.botToken}`;

    // Register the tenant in the public schema
    const tenant = this.tenantRepository.create({tenantName:createTenantDto.tenantName, botToken:createTenantDto.botToken, schemaName });
    await this.tenantRepository.save(tenant);

    // Create a new schema for the tenant
    await this.connection.query(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);

    // You can run migrations or copy tables here
    await this.connection.query(`CREATE TABLE ...`);

    return tenant;
  }


  findAll() {
    return this.tenantRepository.find();
  }

  findOne(id: string) {
    return this.tenantRepository.findOne({ where: { id } });
  }

  update(id: string, updateTenantDto: UpdateTenantDto) {
    return this.tenantRepository.update(id, updateTenantDto);
  }

  remove(id: string) {
    return this.tenantRepository.delete(id);
  }

  async findTenantByBotToken(botToken: string): Promise<Tenant> {
    return this.tenantRepository.findOne({ where: { botToken } });
  }
}

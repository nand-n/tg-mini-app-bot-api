import { Controller, Get, Post, Body, Param, Delete, Patch, Req } from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { TenantService } from './tenant.service';

@Controller('tenants')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

//   @Post()
//   create(@Body() createTenantDto: CreateTenantDto) {
//     return this.tenantService.create(createTenantDto);
//   }
@Post()
create(@Req() req, @Body() createTenantDto: CreateTenantDto) {
  return this.tenantService.registerTenant(createTenantDto);
}

  @Get()
  findAll() {
    return this.tenantService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tenantService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTenantDto: UpdateTenantDto) {
    return this.tenantService.update(id, updateTenantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tenantService.remove(id);
  }
}

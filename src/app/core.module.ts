import { Global, Module } from '@nestjs/common';

import { PermissionModule } from './modules/permission/permission.module';
import { ProductsModule } from './modules/products/products.module';
import { UsersModule } from './modules/users/users.module';
import { ClientsModule } from './modules/clients/clients.module';
import { AnnouncementsModule } from './modules/announcements/announcements.module';
import { TicketsModule } from './modules/tickets/tickets.module';

@Global()
@Module({
  imports: [PermissionModule, ProductsModule, UsersModule, ClientsModule , AnnouncementsModule , TicketsModule ],
})
export class CoreModule {}

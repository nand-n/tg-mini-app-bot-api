import { Global, Module } from '@nestjs/common';
import { PermissionModule } from './modules/permission/permission.module';
import { ProductsModule } from './modules/products/products.module';
import { UsersModule } from './modules/users/users.module';
import { ClientsModule } from './modules/clients/clients.module';
import { AnnouncementsModule } from './modules/announcements/announcements.module';
import { TicketsModule } from './modules/tickets/tickets.module';
import { DrawsModule } from './modules/draw/draw.module';
import { TelegramBotModule } from './modules/telegramBot/telegram.module';
import { ChapaModule } from './modules/chapa-sdk';
import { SpinTheWheelModule } from './modules/spin/spin.module';
import { SegmentModule } from './modules/spin-segments/segment.module';

@Global()
@Module({
  imports: [PermissionModule, ProductsModule, UsersModule, ClientsModule , AnnouncementsModule , TicketsModule , DrawsModule, TelegramBotModule ,SpinTheWheelModule ,SegmentModule, ChapaModule.register({
    secretKey: `CHASECK_TEST-EJCfEadYMB8UTtwE6MzTPJ5KNhwHTn4s`,
  }),],

  
})
export class CoreModule {}


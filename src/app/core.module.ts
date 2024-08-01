import { Global, Module } from '@nestjs/common';

import { PermissionModule } from './modules/permission/permission.module';
import { ProductsModule } from './modules/products/products.module';
import { UsersModule } from './modules/users/users.module';
import { ClientsModule } from './modules/clients/clients.module';
import { AnnouncementsModule } from './modules/announcements/announcements.module';
import { TicketsModule } from './modules/tickets/tickets.module';
// import { PaymentModule } from './modules/payment/payment.module';
// import { ChapaModule } from './modules/chapa-sdk';
import { DrawsModule } from './modules/draw/draw.module';
import { TelegramBotModule } from './modules/telegramBot/telegram.module';
import { ChapaModule } from './modules/chapa-sdk';

@Global()
@Module({
  imports: [PermissionModule, ProductsModule, UsersModule, ClientsModule , AnnouncementsModule , TicketsModule , DrawsModule, TelegramBotModule , ChapaModule.register({
    secretKey: process.env.CHAPA_SECRET_KEY,
  }),],

  
})
export class CoreModule {}

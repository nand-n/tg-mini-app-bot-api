import { MiddlewareConsumer, Module } from "@nestjs/common";
import { sessionMiddleware } from "@root/src/core/middlewares/botSession.midleware";
import { TelegrafModule } from "nestjs-telegraf";
import { LorryAppBotName } from "./constants";
import { GreeterModule } from "./lory-app/lorryApp.module";
import { ContextMiddleware } from "@root/src/core/middlewares/context.telegram";
import { TenantMiddleware } from "@root/src/core/middlewares/tenant.middleware";
import { TenantModule } from "../tenants/tenant.module";

@Module({
    imports: [
      TelegrafModule.forRootAsync({
        botName: LorryAppBotName,
        useFactory: () => ({
          token: process.env.LORRY_TELEGRAM_TOKEN,
          middlewares: [sessionMiddleware],
          include: [GreeterModule],
        }),
      }),
      GreeterModule,
      TenantModule
    ],
  })
  export class TelegramBotModule {
    configure(consumer: MiddlewareConsumer) {
      consumer
        .apply(ContextMiddleware)  
        .forRoutes('*'); 
  
      consumer
        .apply(TenantMiddleware)  
        .forRoutes('*'); 
    }
  }
import { Module } from "@nestjs/common";
import { sessionMiddleware } from "@root/src/core/middlewares/botSession.midleware";
import { TelegrafModule } from "nestjs-telegraf";
import { LorryAppBotName } from "./constants";
import { GreeterModule } from "./lory-app/lorryApp.module";

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
    ],
  })
  export class TelegramBotModule {}
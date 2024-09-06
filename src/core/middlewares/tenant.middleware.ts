// import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
// import { TenantService } from '@root/src/app/modules/tenants/tenant.service';
// import { Request, Response, NextFunction } from 'express';
// import { TelegrafContextType } from 'nestjs-telegraf';
// import { Connection } from 'typeorm';

// @Injectable()
// export class TenantMiddleware implements NestMiddleware {
//   constructor(
//     private readonly tenantService: TenantService,
//     @Inject('TENANT_CONNECTION') private connection: Connection,
//   ) {}

//   async use(req: Request & { ctx?: any }, res: Response, next: NextFunction) {
//     const botId = req.ctx?.botInfo?.id.toString();

//     if (botId) {
//       const tenant = await this.tenantService.findTenantByBotToken(botId);

//       if (tenant) {
//         // Switch to the tenant's schema
//         await this.connection.query(`SET search_path TO "${tenant.schemaName}"`);
//         req['tenantSchema'] = tenant.schemaName;
//       }
//     }

//     next();
//   }
// }

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TelegrafContextType } from 'nestjs-telegraf';

@Injectable()
export class ContextMiddleware implements NestMiddleware {
  async use(req: Request & { ctx?: TelegrafContextType }, res: Response, next: NextFunction) {
    if (req['context']) {
      req.ctx = req['context'];
    }
    next();
  }
}

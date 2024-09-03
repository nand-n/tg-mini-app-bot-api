import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class TenantInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp().getRequest().ctx;
    const botId = ctx?.botInfo?.id;

    if (botId) {
      context.switchToHttp().getRequest().botId = botId;
    }

    return next.handle();
  }
}

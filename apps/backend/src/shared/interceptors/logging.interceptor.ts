import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor
} from '@nestjs/common';
import type { Request } from 'express';
import { Observable, tap } from 'rxjs';

type RequestWithMeta = Request & {
  requestId?: string;
};

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<RequestWithMeta>();
    const startedAt = Date.now();
    const requestId = request.requestId ?? 'unknown';

    return next.handle().pipe(
      tap(() => {
        const elapsedMs = Date.now() - startedAt;
        this.logger.log(`[${requestId}] ${request.method} ${request.url} ${elapsedMs}ms`);
      })
    );
  }
}

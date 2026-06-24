import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

type AuthenticatedRequest = Request & {
  user?: {
    sub: string;
    email: string;
    role: 'ADMIN' | 'USER';
  };
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthenticatedRequest['user'] => {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    return request.user;
  }
);

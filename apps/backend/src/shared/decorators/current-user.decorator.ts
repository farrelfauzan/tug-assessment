import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

export type AuthenticatedUser = {
  sub: string;
  email: string;
  role: 'ADMIN' | 'USER';
};

type AuthenticatedRequest = Request & {
  user?: AuthenticatedUser;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthenticatedRequest['user'] => {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    return request.user;
  }
);

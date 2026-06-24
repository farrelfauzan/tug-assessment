import { UnauthorizedException } from '@nestjs/common';
import type { AuthenticatedUser } from './current-user.decorator';

export type { AuthenticatedUser } from './current-user.decorator';

export function requireCurrentUser(user: AuthenticatedUser | undefined): AuthenticatedUser {
  if (!user) {
    throw new UnauthorizedException('Missing authenticated user');
  }

  return user;
}

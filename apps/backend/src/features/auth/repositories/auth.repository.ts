import { Injectable } from '@nestjs/common';
import type { User } from '@prisma/client';
import { PrismaService } from '../../../shared/prisma/prisma.service';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        email,
        deletedAt: null
      }
    });
  }

  findById(id: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        id,
        deletedAt: null
      }
    });
  }

  updateRefreshTokenHash(userId: string, refreshTokenHash: string): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash }
    });
  }

  clearRefreshTokenHash(userId: string): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: null }
    });
  }
}

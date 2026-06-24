import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getJwtSecret } from '../../../shared/auth/jwt.config';
import { AuthRepository } from '../repositories/auth.repository';
import { AuthService } from './auth.service';

vi.mock('bcryptjs', () => ({
  default: {
    compare: vi.fn(),
    hash: vi.fn()
  }
}));

vi.mock('../../../shared/auth/jwt.config', () => ({
  getJwtSecret: vi.fn()
}));

describe('AuthService', () => {
  const authRepository = {
    findByEmail: vi.fn(),
    findById: vi.fn(),
    updateRefreshTokenHash: vi.fn(),
    clearRefreshTokenHash: vi.fn()
  } as unknown as AuthRepository;

  const jwtService = {
    signAsync: vi.fn(),
    verifyAsync: vi.fn()
  } as unknown as JwtService;

  let service: AuthService;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getJwtSecret).mockReturnValue('test-jwt-secret');
    service = new AuthService(authRepository, jwtService);
  });

  it('logs in with valid credentials', async () => {
    authRepository.findByEmail = vi.fn().mockResolvedValue({
      id: 'u1',
      email: 'admin@example.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      passwordHash: 'hashed'
    });

    vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
    jwtService.signAsync = vi
      .fn()
      .mockResolvedValueOnce('access-token')
      .mockResolvedValueOnce('refresh-token');
    vi.mocked(bcrypt.hash).mockResolvedValue('refresh-hash' as never);

    const result = await service.login({
      email: 'admin@example.com',
      password: 'Admin123!'
    });

    expect(result.accessToken).toBe('access-token');
    expect(result.refreshToken).toBe('refresh-token');
    expect(authRepository.updateRefreshTokenHash).toHaveBeenCalledWith('u1', 'refresh-hash');
  });

  it('throws unauthorized when email is unknown', async () => {
    authRepository.findByEmail = vi.fn().mockResolvedValue(null);

    await expect(
      service.login({
        email: 'missing@example.com',
        password: 'Admin123!'
      })
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('throws unauthorized when password does not match', async () => {
    authRepository.findByEmail = vi.fn().mockResolvedValue({
      id: 'u1',
      email: 'admin@example.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      passwordHash: 'hashed'
    });
    vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

    await expect(
      service.login({
        email: 'admin@example.com',
        password: 'WrongPass123!'
      })
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { LoginInput, LoginResponse, RefreshResponse } from '@tug/api-schemas';
import bcrypt from 'bcryptjs';
import { AuthRepository } from '../repositories/auth.repository';

type AccessTokenPayload = {
  sub: string;
  email: string;
  role: 'ADMIN' | 'USER';
};

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService
  ) {}

  async login(input: LoginInput): Promise<LoginResponse> {
    const user = await this.authRepository.findByEmail(input.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens({
      sub: user.id,
      email: user.email,
      role: user.role
    });

    const refreshTokenHash = await bcrypt.hash(tokens.refreshToken, 10);
    await this.authRepository.updateRefreshTokenHash(user.id, refreshTokenHash);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    };
  }

  async refresh(refreshToken: string): Promise<RefreshResponse> {
    const payload = await this.verifyRefreshToken(refreshToken);
    const user = await this.authRepository.findById(payload.sub);

    if (!user || !user.refreshTokenHash) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokenMatches = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!tokenMatches) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokens = await this.generateTokens({
      sub: user.id,
      email: user.email,
      role: user.role
    });

    const refreshTokenHash = await bcrypt.hash(tokens.refreshToken, 10);
    await this.authRepository.updateRefreshTokenHash(user.id, refreshTokenHash);

    return tokens;
  }

  async logout(userId: string): Promise<{ message: string }> {
    await this.authRepository.clearRefreshTokenHash(userId);
    return { message: 'Successfully logged out' };
  }

  private async generateTokens(payload: AccessTokenPayload): Promise<RefreshResponse> {
    const secret = process.env.JWT_SECRET ?? 'local-dev-secret';
    const accessExpiresIn = process.env.JWT_EXPIRES_IN ?? '15m';
    const refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN ?? '7d';

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret,
        expiresIn: accessExpiresIn
      }),
      this.jwtService.signAsync(payload, {
        secret,
        expiresIn: refreshExpiresIn
      })
    ]);

    return {
      accessToken,
      refreshToken
    };
  }

  private async verifyRefreshToken(token: string): Promise<AccessTokenPayload> {
    const secret = process.env.JWT_SECRET ?? 'local-dev-secret';
    try {
      return await this.jwtService.verifyAsync<AccessTokenPayload>(token, {
        secret
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}

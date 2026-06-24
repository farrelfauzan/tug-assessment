import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import {
  type AuthenticatedUser,
  requireCurrentUser
} from '../../shared/decorators/require-current-user.decorator';
import {
  logoutResponseSchema,
  refreshTokenSchema,
  type LoginResponse,
  type RefreshResponse
} from '@tug/api-schemas';
import {
  clearAuthCookies,
  getRefreshTokenFromCookie,
  setAuthCookies
} from '../../shared/auth/auth-cookie';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { LoginDto } from './api/auth.dto';
import { AuthService } from './services/auth.service';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) httpResponse: Response
  ): Promise<{ success: true; data: LoginResponse }> {
    const data = await this.authService.login(body);
    setAuthCookies(httpResponse, {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken
    });

    return {
      success: true,
      data
    };
  }

  @Post('refresh')
  async refresh(
    @Body() body: { refreshToken?: string },
    @Req() request: Request,
    @Res({ passthrough: true }) httpResponse: Response
  ): Promise<{ success: true; data: RefreshResponse }> {
    const tokenCandidate = body.refreshToken ?? getRefreshTokenFromCookie(request);
    const parsed = refreshTokenSchema.safeParse({ refreshToken: tokenCandidate });

    if (!parsed.success) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const data = await this.authService.refresh(parsed.data.refreshToken);
    setAuthCookies(httpResponse, {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken
    });

    return {
      success: true,
      data
    };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async logout(
    @CurrentUser()
    user: AuthenticatedUser | undefined,
    @Res({ passthrough: true }) httpResponse: Response
  ) {
    const actor = requireCurrentUser(user);
    clearAuthCookies(httpResponse);

    const result = await this.authService.logout(actor.sub);
    return {
      success: true,
      data: logoutResponseSchema.parse(result)
    };
  }
}

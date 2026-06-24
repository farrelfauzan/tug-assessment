import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  logoutResponseSchema,
  type LoginResponse,
  type RefreshResponse
} from '@tug/api-schemas';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { LoginDto, RefreshTokenDto } from './api/auth.dto';
import { AuthService } from './services/auth.service';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto): Promise<{ success: true; data: LoginResponse }> {
    return {
      success: true,
      data: await this.authService.login(body)
    };
  }

  @Post('refresh')
  async refresh(@Body() body: RefreshTokenDto): Promise<{ success: true; data: RefreshResponse }> {
    return {
      success: true,
      data: await this.authService.refresh(body.refreshToken)
    };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async logout(
    @CurrentUser()
    user: {
      sub: string;
      email: string;
      role: 'ADMIN' | 'USER';
    } | undefined
  ) {
    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }

    const response = await this.authService.logout(user.sub);
    return {
      success: true,
      data: logoutResponseSchema.parse(response)
    };
  }
}

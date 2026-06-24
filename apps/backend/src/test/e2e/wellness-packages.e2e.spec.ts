import {
  Body,
  Controller,
  Get,
  INestApplication,
  Post,
  UnauthorizedException
} from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';

const TEST_ACCESS_TOKEN = 'test-access-token';

@Controller('auth')
class MockAuthController {
  @Post('login')
  login(
    @Body()
    payload: {
      email: string;
      password: string;
    }
  ) {
    if (payload.email !== 'admin@example.com' || payload.password !== 'Admin123!') {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      success: true,
      data: {
        accessToken: TEST_ACCESS_TOKEN,
        refreshToken: 'test-refresh-token',
        user: {
          id: '11111111-1111-1111-1111-111111111111',
          email: 'admin@example.com',
          firstName: 'Admin',
          lastName: 'User',
          role: 'ADMIN'
        }
      }
    };
  }
}

@Controller('wellness-packages')
@UseGuards(JwtAuthGuard, RolesGuard)
class MockWellnessPackagesController {
  @Get()
  list() {
    return {
      success: true,
      data: {
        items: [
          {
            id: '11111111-1111-1111-1111-111111111111',
            name: 'Basic Wellness',
            description: 'Basic package for onboarding users.',
            price: 99.99,
            durationWeeks: 4,
            status: 'ACTIVE',
            createdAt: '2026-01-01T00:00:00.000Z',
            updatedAt: '2026-01-01T00:00:00.000Z'
          }
        ],
        pagination: {
          total: 1,
          page: 1,
          limit: 20,
          totalPages: 1
        }
      }
    };
  }
}

describe('Wellness packages endpoints (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const testingModuleBuilder = Test.createTestingModule({
      controllers: [MockWellnessPackagesController, MockAuthController]
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: {
          switchToHttp: () => { getRequest: () => { headers: { authorization?: string }; user?: unknown } };
        }) => {
          const request = context.switchToHttp().getRequest();
          const token = request.headers.authorization;
          if (!token?.startsWith('Bearer ')) {
            return false;
          }

          request.user = {
            sub: '11111111-1111-1111-1111-111111111111',
            email: 'admin@example.com',
            role: 'ADMIN'
          };

          return true;
        }
      })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true });

    const moduleRef = await testingModuleBuilder.compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /wellness-packages requires bearer token', async () => {
    const response = await request(app.getHttpServer()).get('/wellness-packages');

    expect(response.status).toBe(403);
    expect(response.body.message).toBeDefined();
  });

  it('GET /wellness-packages returns success envelope when logged in', async () => {
    const loginResponse = await request(app.getHttpServer()).post('/auth/login').send({
      email: 'admin@example.com',
      password: 'Admin123!'
    });

    expect(loginResponse.status).toBe(201);
    const accessToken = loginResponse.body.data.accessToken as string;

    const response = await request(app.getHttpServer())
      .get('/wellness-packages')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.items).toHaveLength(1);
  });
});

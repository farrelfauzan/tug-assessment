import {
  Body,
  Controller,
  INestApplication,
  Post,
  UnauthorizedException
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

@Controller('auth')
class MockAuthController {
  @Post('login')
  login(
    @Body()
    _payload: {
      email: string;
      password: string;
    }
  ): never {
    throw new UnauthorizedException('Invalid credentials');
  }
}

describe('Auth login endpoint (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [MockAuthController]
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('POST /auth/login rejects invalid credentials envelope', async () => {
    const response = await request(app.getHttpServer()).post('/auth/login').send({
      email: 'unknown@example.com',
      password: 'WrongPass123!'
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid credentials');
  });
});

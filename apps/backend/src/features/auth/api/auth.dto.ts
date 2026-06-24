import {
  loginSchema,
  refreshTokenSchema,
  type LoginInput,
  type RefreshTokenInput
} from '@tug/api-schemas';
import { createZodDto } from 'nestjs-zod';

export class LoginDto extends createZodDto(loginSchema) {}
export class RefreshTokenDto extends createZodDto(refreshTokenSchema) {}

export type LoginDtoType = LoginInput;
export type RefreshTokenDtoType = RefreshTokenInput;

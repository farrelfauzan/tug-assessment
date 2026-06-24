import { loginSchema, type LoginInput } from '@tug/api-schemas';
import { createZodDto } from 'nestjs-zod';

export class LoginDto extends createZodDto(loginSchema) {}

export type LoginDtoType = LoginInput;

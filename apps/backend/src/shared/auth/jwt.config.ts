const TEST_JWT_SECRET = 'test-jwt-secret';

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET?.trim();

  if (secret) {
    return secret;
  }

  if (process.env.NODE_ENV === 'test') {
    return TEST_JWT_SECRET;
  }

  throw new Error('JWT_SECRET is required');
}

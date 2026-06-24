import { cookies } from 'next/headers';

const ACCESS_TOKEN_COOKIE_KEY = 'accessToken';

export function hasAccessTokenSession(): boolean {
  const token = cookies().get(ACCESS_TOKEN_COOKIE_KEY)?.value;
  return typeof token === 'string' && token.length > 0;
}

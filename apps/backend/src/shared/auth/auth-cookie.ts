import type { CookieOptions, Request, Response } from 'express';

const ACCESS_TOKEN_COOKIE_KEY = 'accessToken';
const REFRESH_TOKEN_COOKIE_KEY = 'refreshToken';

type Tokens = {
  accessToken: string;
  refreshToken: string;
};

function getCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/'
  };
}

function readCookie(request: Request, key: string): string | undefined {
  const cookieHeader = request.headers.cookie;
  if (!cookieHeader) {
    return undefined;
  }

  const cookiePair = cookieHeader
    .split(';')
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${key}=`));

  if (!cookiePair) {
    return undefined;
  }

  const value = cookiePair.slice(key.length + 1);
  if (!value) {
    return undefined;
  }

  try {
    return decodeURIComponent(value);
  } catch {
    return undefined;
  }
}

export function setAuthCookies(response: Response, tokens: Tokens): void {
  const options = getCookieOptions();
  response.cookie(ACCESS_TOKEN_COOKIE_KEY, tokens.accessToken, options);
  response.cookie(REFRESH_TOKEN_COOKIE_KEY, tokens.refreshToken, options);
}

export function clearAuthCookies(response: Response): void {
  const options = getCookieOptions();
  response.clearCookie(ACCESS_TOKEN_COOKIE_KEY, options);
  response.clearCookie(REFRESH_TOKEN_COOKIE_KEY, options);
}

export function getAccessTokenFromCookie(request: Request): string | undefined {
  return readCookie(request, ACCESS_TOKEN_COOKIE_KEY);
}

export function getRefreshTokenFromCookie(request: Request): string | undefined {
  return readCookie(request, REFRESH_TOKEN_COOKIE_KEY);
}

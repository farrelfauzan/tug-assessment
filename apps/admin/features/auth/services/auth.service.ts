import { type LoginInput, type LoginResponse, type RefreshResponse } from '@tug/api-schemas';
import { api } from '../../../lib/api';

type ApiSuccess<T> = {
  success: true;
  data: T;
};

export async function login(input: LoginInput): Promise<LoginResponse> {
  const response = await api.post<ApiSuccess<LoginResponse>>('/auth/login', input);
  return response.data.data;
}

export async function refresh(): Promise<RefreshResponse> {
  const response = await api.post<ApiSuccess<RefreshResponse>>('/auth/refresh', {});
  return response.data.data;
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout');
}

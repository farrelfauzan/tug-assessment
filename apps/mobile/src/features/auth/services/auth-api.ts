import type { LoginInput, LoginResponse } from '@tug/api-schemas';
import { api } from '../../../services/api';

type ApiEnvelope<TData> = {
  success: boolean;
  data: TData;
};

export async function login(payload: LoginInput): Promise<LoginResponse> {
  const response = await api.post<ApiEnvelope<LoginResponse>>('/auth/login', payload);
  return response.data.data;
}

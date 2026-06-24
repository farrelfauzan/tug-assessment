import axios, { type InternalAxiosRequestConfig } from 'axios';

const DEFAULT_BASE_URL = 'http://localhost:3001';

type RetryableConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_BASE_URL,
  timeout: 10_000,
  withCredentials: true
});

function isAuthEndpoint(url: string): boolean {
  return url.startsWith('/auth/login') || url.startsWith('/auth/refresh');
}

api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    const axiosError = axios.isAxiosError(error) ? error : undefined;
    const status = axiosError?.response?.status;
    const originalConfig = axiosError?.config as RetryableConfig | undefined;

    if (typeof window !== 'undefined' && status === 401 && originalConfig) {
      const requestUrl = typeof originalConfig.url === 'string' ? originalConfig.url : '';

      if (!originalConfig._retry && !isAuthEndpoint(requestUrl)) {
        originalConfig._retry = true;

        try {
          await api.post('/auth/refresh', {});
          return api(originalConfig);
        } catch {
          window.location.href = '/login';
          return Promise.reject(error);
        }
      }

      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

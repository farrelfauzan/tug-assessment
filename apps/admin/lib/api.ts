import axios from 'axios';

const DEFAULT_BASE_URL = 'http://localhost:3001';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_BASE_URL,
  timeout: 10_000
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = window.localStorage.getItem('admin.accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

import Constants from "expo-constants";
import axios, { AxiosHeaders } from "axios";

const DEFAULT_API_URL = "http://10.0.2.2:3001";

const API_URL =
  (Constants.expoConfig?.extra?.apiUrl as string | undefined) ??
  DEFAULT_API_URL;

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10_000,
});

console.log(`API URL: ${API_URL}`);

let authToken: string | null = null;

export function setApiAuthToken(token: string | null): void {
  authToken = token;
}

api.interceptors.request.use((config) => {
  const headers = AxiosHeaders.from(config.headers);

  if (authToken) {
    headers.set("Authorization", `Bearer ${authToken}`);
  } else {
    headers.delete("Authorization");
  }

  config.headers = headers;

  return config;
});

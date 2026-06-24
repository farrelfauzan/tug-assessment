import axios from 'axios';
import Constants from 'expo-constants';

const DEFAULT_API_URL = 'http://localhost:3001';
const API_URL =
  (Constants.expoConfig?.extra?.apiUrl as string | undefined) ?? DEFAULT_API_URL;

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10_000
});

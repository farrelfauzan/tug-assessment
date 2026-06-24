import { api } from '../../../lib/api';

type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type WellnessPackageItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  durationWeeks: number;
  status: 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
};

export type WellnessPackageList = {
  items: WellnessPackageItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type CreateWellnessPackagePayload = {
  name: string;
  description: string;
  price: number;
  durationWeeks: number;
  status: 'DRAFT' | 'ACTIVE';
};

export async function listWellnessPackages(): Promise<WellnessPackageList> {
  const response = await api.get<ApiSuccess<WellnessPackageList>>('/wellness-packages');
  return response.data.data;
}

export async function createWellnessPackage(
  payload: CreateWellnessPackagePayload
): Promise<WellnessPackageItem> {
  const response = await api.post<ApiSuccess<WellnessPackageItem>>('/wellness-packages', payload);
  return response.data.data;
}

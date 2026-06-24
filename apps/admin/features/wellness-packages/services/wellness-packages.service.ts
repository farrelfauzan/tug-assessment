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

export async function listWellnessPackages(): Promise<WellnessPackageList> {
  const response = await api.get<ApiSuccess<WellnessPackageList>>('/wellness-packages');
  return response.data.data;
}

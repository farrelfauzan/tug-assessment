import { api } from '../../../services/api';
import type {
  ReviewsResponse,
  WellnessPackageItem,
  WellnessPackageListResponse
} from '../types/wellness-package-types';

type ApiEnvelope<TData> = {
  success: boolean;
  data: TData;
};

export async function fetchWellnessPackages(search: string): Promise<WellnessPackageListResponse> {
  const response = await api.get<ApiEnvelope<WellnessPackageListResponse>>('/wellness-packages', {
    params: {
      status: 'ACTIVE',
      search: search.trim().length > 0 ? search.trim() : undefined
    }
  });

  return response.data.data;
}

export async function fetchWellnessPackageById(id: string): Promise<WellnessPackageItem> {
  const response = await api.get<ApiEnvelope<WellnessPackageItem>>(`/wellness-packages/${id}`);
  return response.data.data;
}

export async function fetchPackageReviews(packageId: string): Promise<ReviewsResponse> {
  const response = await api.get<ApiEnvelope<ReviewsResponse>>('/reviews', {
    params: {
      packageId
    }
  });

  return response.data.data;
}

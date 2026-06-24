import { api } from '../../../services/api';

type ApiEnvelope<TData> = {
  success: boolean;
  data: TData;
};

type CreatedReview = {
  id: string;
  rating: number;
  comment: string | null;
};

export type CreateReviewPayload = {
  wellnessPackageId: string;
  rating: number;
  comment?: string;
};

export async function createReview(payload: CreateReviewPayload): Promise<CreatedReview> {
  const response = await api.post<ApiEnvelope<CreatedReview>>('/reviews', payload);
  return response.data.data;
}

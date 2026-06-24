import { api } from '../../../lib/api';

type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type ReviewItem = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
  };
  wellnessPackage: {
    name: string;
  };
};

export type ReviewsList = {
  items: ReviewItem[];
  averageRating: number | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export async function listReviews(): Promise<ReviewsList> {
  const response = await api.get<ApiSuccess<ReviewsList>>('/reviews');
  return response.data.data;
}

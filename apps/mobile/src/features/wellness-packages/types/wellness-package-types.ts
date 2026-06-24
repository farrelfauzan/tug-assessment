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

export type WellnessPackageListResponse = {
  items: WellnessPackageItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type ReviewItem = {
  id: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  wellnessPackage: {
    id: string;
    name: string;
  };
  rating: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ReviewsResponse = {
  items: ReviewItem[];
  averageRating: number | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

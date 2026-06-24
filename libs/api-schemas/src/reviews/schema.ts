import { z } from 'zod';

export const createReviewSchema = z.object({
  wellnessPackageId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(10).max(1000).optional()
});

export const listReviewsQuerySchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  rating: z.number().int().min(1).max(5).optional(),
  packageId: z.string().uuid().optional()
});

export const reviewIdSchema = z.object({
  id: z.string().uuid()
});

export const updateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  comment: z.string().min(10).max(1000).optional()
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type ListReviewsQuery = z.infer<typeof listReviewsQuerySchema>;
export type ReviewIdInput = z.infer<typeof reviewIdSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;

import {
  createReviewSchema,
  listReviewsQuerySchema,
  reviewIdSchema,
  updateReviewSchema,
  type CreateReviewInput,
  type ListReviewsQuery,
  type ReviewIdInput,
  type UpdateReviewInput
} from '@tug/api-schemas';
import { createZodDto } from 'nestjs-zod';

export class CreateReviewDto extends createZodDto(createReviewSchema) {}
export class ListReviewsQueryDto extends createZodDto(listReviewsQuerySchema) {}
export class ReviewIdDto extends createZodDto(reviewIdSchema) {}
export class UpdateReviewDto extends createZodDto(updateReviewSchema) {}

export type CreateReviewDtoType = CreateReviewInput;
export type ListReviewsQueryDtoType = ListReviewsQuery;
export type ReviewIdDtoType = ReviewIdInput;
export type UpdateReviewDtoType = UpdateReviewInput;

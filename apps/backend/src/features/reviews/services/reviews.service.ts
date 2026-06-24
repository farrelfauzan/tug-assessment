import {
  Injectable,
  NotFoundException
} from '@nestjs/common';
import type { CreateReviewInput, ListReviewsQuery, UpdateReviewInput } from '@tug/api-schemas';
import { toPagination } from '@tug/utils';
import { ReviewsRepository } from '../repositories/reviews.repository';

type ReviewResponse = {
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

type RequestActor = {
  id: string;
  role: 'ADMIN' | 'USER';
};

@Injectable()
export class ReviewsService {
  constructor(private readonly reviewsRepository: ReviewsRepository) {}

  async create(input: CreateReviewInput & { userId: string }): Promise<ReviewResponse> {
    const [userExists, packageExists] = await Promise.all([
      this.reviewsRepository.userExists(input.userId),
      this.reviewsRepository.packageExists(input.wellnessPackageId)
    ]);

    if (!userExists) {
      throw new NotFoundException('User not found');
    }

    if (!packageExists) {
      throw new NotFoundException('Wellness package not found');
    }

    const created = await this.reviewsRepository.create({
      userId: input.userId,
      wellnessPackageId: input.wellnessPackageId,
      rating: input.rating,
      comment: input.comment
    });

    return this.toResponse(created);
  }

  async list(query: ListReviewsQuery, actor: RequestActor): Promise<{
    items: ReviewResponse[];
    averageRating: number | null;
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const pagination = toPagination({
      page: query.page,
      limit: query.limit
    });

    const [result, averageRating] = await Promise.all([
      this.reviewsRepository.list({
        skip: pagination.offset,
        take: pagination.limit,
        rating: query.rating,
        packageId: query.packageId,
        userId: actor.role === 'USER' ? actor.id : undefined
      }),
      this.reviewsRepository.averageRating({
        rating: query.rating,
        packageId: query.packageId,
        userId: actor.role === 'USER' ? actor.id : undefined
      })
    ]);

    return {
      items: result.items.map((item) => this.toResponse(item)),
      averageRating,
      pagination: {
        total: result.total,
        page: pagination.page,
        limit: pagination.limit,
        totalPages: result.total === 0 ? 0 : Math.ceil(result.total / pagination.limit)
      }
    };
  }

  async update(id: string, input: UpdateReviewInput): Promise<ReviewResponse> {
    await this.assertExists(id);
    const updated = await this.reviewsRepository.update(id, {
      ...(input.rating !== undefined ? { rating: input.rating } : {}),
      ...(input.comment !== undefined ? { comment: input.comment } : {})
    });

    return this.toResponse(updated);
  }

  async remove(id: string): Promise<{ message: string }> {
    await this.assertExists(id);
    await this.reviewsRepository.softDelete(id);
    return { message: 'Review deleted successfully' };
  }

  private async assertExists(id: string): Promise<void> {
    const existing = await this.reviewsRepository.findById(id);
    if (!existing) {
      throw new NotFoundException('Review not found');
    }
  }

  private toResponse(review: {
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
    createdAt: Date;
    updatedAt: Date;
  }): ReviewResponse {
    return {
      id: review.id,
      user: {
        id: review.user.id,
        email: review.user.email,
        firstName: review.user.firstName,
        lastName: review.user.lastName
      },
      wellnessPackage: {
        id: review.wellnessPackage.id,
        name: review.wellnessPackage.name
      },
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt.toISOString(),
      updatedAt: review.updatedAt.toISOString()
    };
  }
}

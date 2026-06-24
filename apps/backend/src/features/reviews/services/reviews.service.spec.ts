import { NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ReviewsRepository } from '../repositories/reviews.repository';
import { ReviewsService } from './reviews.service';

describe('ReviewsService', () => {
  const repository = {
    userExists: vi.fn(),
    packageExists: vi.fn(),
    create: vi.fn(),
    list: vi.fn(),
    averageRating: vi.fn(),
    findById: vi.fn(),
    update: vi.fn(),
    softDelete: vi.fn()
  } as unknown as ReviewsRepository;

  let service: ReviewsService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new ReviewsService(repository);
  });

  it('creates review when user and package exist', async () => {
    repository.userExists = vi.fn().mockResolvedValue(true);
    repository.packageExists = vi.fn().mockResolvedValue(true);
    repository.create = vi.fn().mockResolvedValue({
      id: 'review-1',
      user: {
        id: 'user-1',
        email: 'user@example.com',
        firstName: 'Mobile',
        lastName: 'User'
      },
      wellnessPackage: {
        id: 'package-1',
        name: 'Basic'
      },
      rating: 5,
      comment: 'Great package and support',
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-01T00:00:00.000Z')
    });

    const result = await service.create({
      userId: 'user-1',
      wellnessPackageId: 'package-1',
      rating: 5,
      comment: 'Great package and support'
    });

    expect(result.rating).toBe(5);
    expect(result.wellnessPackage.id).toBe('package-1');
  });

  it('throws when user does not exist', async () => {
    repository.userExists = vi.fn().mockResolvedValue(false);
    repository.packageExists = vi.fn().mockResolvedValue(true);

    await expect(
      service.create({
        userId: 'missing-user',
        wellnessPackageId: 'package-1',
        rating: 5,
        comment: 'Great package and support'
      })
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('returns paginated review list with average rating', async () => {
    repository.list = vi.fn().mockResolvedValue({
      items: [
        {
          id: 'review-1',
          user: {
            id: 'user-1',
            email: 'user@example.com',
            firstName: 'Mobile',
            lastName: 'User'
          },
          wellnessPackage: {
            id: 'package-1',
            name: 'Basic'
          },
          rating: 5,
          comment: 'Great package and support',
          createdAt: new Date('2026-01-01T00:00:00.000Z'),
          updatedAt: new Date('2026-01-01T00:00:00.000Z')
        }
      ],
      total: 1
    });
    repository.averageRating = vi.fn().mockResolvedValue(5);

    const result = await service.list({ page: 1, limit: 20 });

    expect(result.items).toHaveLength(1);
    expect(result.averageRating).toBe(5);
    expect(result.pagination.total).toBe(1);
  });
});

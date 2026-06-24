import { NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { WellnessPackagesRepository } from '../repositories/wellness-packages.repository';
import { WellnessPackagesService } from './wellness-packages.service';

describe('WellnessPackagesService', () => {
  const repository = {
    list: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn()
  } as unknown as WellnessPackagesRepository;

  let service: WellnessPackagesService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new WellnessPackagesService(repository);
  });

  it('lists packages with pagination', async () => {
    repository.list = vi.fn().mockResolvedValue({
      items: [
        {
          id: 'pkg-1',
          name: 'Basic',
          description: 'Basic package description',
          price: new Prisma.Decimal('100.00'),
          durationWeeks: 4,
          status: 'ACTIVE',
          createdAt: new Date('2026-01-01T00:00:00.000Z'),
          updatedAt: new Date('2026-01-02T00:00:00.000Z')
        }
      ],
      total: 1
    });

    const result = await service.list({ page: 1, limit: 20 });

    expect(result.items).toHaveLength(1);
    expect(result.pagination.total).toBe(1);
    expect(result.items[0]?.price).toBe(100);
  });

  it('throws when package is missing', async () => {
    repository.findById = vi.fn().mockResolvedValue(null);

    await expect(service.getById('missing-id')).rejects.toBeInstanceOf(NotFoundException);
  });
});

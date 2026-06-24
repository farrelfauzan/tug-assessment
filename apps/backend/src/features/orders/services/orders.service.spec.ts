import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OrdersRepository } from '../repositories/orders.repository';
import { OrdersService } from './orders.service';

describe('OrdersService', () => {
  const repository = {
    create: vi.fn(),
    list: vi.fn(),
    findById: vi.fn(),
    updateStatus: vi.fn()
  } as unknown as OrdersRepository;

  let service: OrdersService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new OrdersService(repository);
  });

  const orderFixture = {
    id: 'order-1',
    user: {
      id: 'user-1',
      email: 'user@example.com',
      firstName: 'Mobile',
      lastName: 'User'
    },
    wellnessPackage: {
      id: 'package-1',
      name: 'Basic Wellness',
      description: 'desc'
    },
    items: [
      {
        id: 'item-1',
        quantity: 1,
        unitPrice: new Prisma.Decimal('100.00')
      }
    ],
    status: 'PENDING' as const,
    totalAmount: new Prisma.Decimal('100.00'),
    orderDate: new Date('2026-01-01T00:00:00.000Z'),
    payment: null,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z')
  };

  it('creates order and maps decimal totals', async () => {
    repository.create = vi.fn().mockResolvedValue(orderFixture);

    const result = await service.create({
      userId: 'user-1',
      wellnessPackageId: 'package-1',
      quantity: 1,
      paymentProvider: 'STRIPE'
    });

    expect(result.totalAmount).toBe(100);
    expect(result.items[0]?.unitPrice).toBe(100);
  });

  it('throws not found if create cannot find active package', async () => {
    repository.create = vi.fn().mockResolvedValue(null);

    await expect(
      service.create({
        userId: 'user-1',
        wellnessPackageId: 'missing',
        quantity: 1,
        paymentProvider: 'STRIPE'
      })
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('rejects invalid status transition', async () => {
    repository.findById = vi.fn().mockResolvedValue(orderFixture);

    await expect(
      service.updateStatus('order-1', {
        status: 'DELIVERED'
      })
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});

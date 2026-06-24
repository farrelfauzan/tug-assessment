import { Injectable, NotFoundException } from '@nestjs/common';
import type {
  CreateWellnessPackageInput,
  UpdateWellnessPackageInput,
  WellnessPackageListQuery,
  WellnessPackageListResponse
} from '@tug/api-schemas';
import { toPagination } from '@tug/utils';
import { Prisma } from '@prisma/client';
import { WellnessPackagesRepository } from '../repositories/wellness-packages.repository';

type WellnessPackageResponse = {
  id: string;
  name: string;
  description: string;
  price: number;
  durationWeeks: number;
  status: 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
};

@Injectable()
export class WellnessPackagesService {
  constructor(private readonly repository: WellnessPackagesRepository) {}

  async list(query: WellnessPackageListQuery): Promise<WellnessPackageListResponse> {
    const pagination = toPagination({
      page: query.page,
      limit: query.limit
    });

    const { items, total } = await this.repository.list({
      skip: pagination.offset,
      take: pagination.limit,
      status: query.status,
      search: query.search
    });

    return {
      items: items.map((item) => this.toResponse(item)),
      pagination: {
        total,
        page: pagination.page,
        limit: pagination.limit,
        totalPages: total === 0 ? 0 : Math.ceil(total / pagination.limit)
      }
    };
  }

  async getById(id: string): Promise<WellnessPackageResponse> {
    const item = await this.repository.findById(id);
    if (!item) {
      throw new NotFoundException('Wellness package not found');
    }
    return this.toResponse(item);
  }

  async create(input: CreateWellnessPackageInput): Promise<WellnessPackageResponse> {
    const created = await this.repository.create({
      name: input.name,
      description: input.description,
      price: new Prisma.Decimal(input.price),
      durationWeeks: input.durationWeeks,
      status: input.status
    });

    return this.toResponse(created);
  }

  async update(id: string, input: UpdateWellnessPackageInput): Promise<WellnessPackageResponse> {
    await this.assertExists(id);
    const data: Prisma.WellnessPackageUpdateInput = {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.price !== undefined ? { price: new Prisma.Decimal(input.price) } : {}),
      ...(input.durationWeeks !== undefined ? { durationWeeks: input.durationWeeks } : {}),
      ...(input.status !== undefined ? { status: input.status } : {})
    };

    const updated = await this.repository.update(id, data);
    return this.toResponse(updated);
  }

  async remove(id: string): Promise<{ message: string }> {
    await this.assertExists(id);
    await this.repository.update(id, {
      deletedAt: new Date(),
      status: 'ARCHIVED'
    });
    return { message: 'Package deleted successfully' };
  }

  private async assertExists(id: string): Promise<void> {
    const item = await this.repository.findById(id);
    if (!item) {
      throw new NotFoundException('Wellness package not found');
    }
  }

  private toResponse(item: {
    id: string;
    name: string;
    description: string;
    price: Prisma.Decimal;
    durationWeeks: number;
    status: 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
    createdAt: Date;
    updatedAt: Date;
  }): WellnessPackageResponse {
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      price: Number(item.price),
      durationWeeks: item.durationWeeks,
      status: item.status,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString()
    };
  }
}

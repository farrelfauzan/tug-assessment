import { Injectable } from '@nestjs/common';
import {
  Prisma,
  type PackageStatus,
  type WellnessPackage
} from '@prisma/client';
import { PrismaService } from '../../../shared/prisma/prisma.service';

type ListArgs = {
  skip: number;
  take: number;
  status?: PackageStatus;
  search?: string;
};

@Injectable()
export class WellnessPackagesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async list(args: ListArgs): Promise<{ items: WellnessPackage[]; total: number }> {
    const where: Prisma.WellnessPackageWhereInput = {
      deletedAt: null,
      ...(args.status ? { status: args.status } : {}),
      ...(args.search
        ? {
            OR: [
              {
                name: {
                  contains: args.search,
                  mode: 'insensitive'
                }
              },
              {
                description: {
                  contains: args.search,
                  mode: 'insensitive'
                }
              }
            ]
          }
        : {})
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.wellnessPackage.findMany({
        where,
        orderBy: {
          createdAt: 'desc'
        },
        skip: args.skip,
        take: args.take
      }),
      this.prisma.wellnessPackage.count({ where })
    ]);

    return { items, total };
  }

  findById(id: string): Promise<WellnessPackage | null> {
    return this.prisma.wellnessPackage.findFirst({
      where: {
        id,
        deletedAt: null
      }
    });
  }

  create(data: Prisma.WellnessPackageCreateInput): Promise<WellnessPackage> {
    return this.prisma.wellnessPackage.create({ data });
  }

  update(id: string, data: Prisma.WellnessPackageUpdateInput): Promise<WellnessPackage> {
    return this.prisma.wellnessPackage.update({
      where: { id },
      data
    });
  }
}

import { Injectable } from '@nestjs/common';
import { Prisma, type Review } from '@prisma/client';
import { PrismaService } from '../../../shared/prisma/prisma.service';

type ReviewWithRelations = Prisma.ReviewGetPayload<{
  include: {
    user: true;
    wellnessPackage: true;
  };
}>;

@Injectable()
export class ReviewsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    userId: string;
    wellnessPackageId: string;
    rating: number;
    comment?: string;
  }): Promise<ReviewWithRelations> {
    return this.prisma.review.create({
      data,
      include: {
        user: true,
        wellnessPackage: true
      }
    });
  }

  async list(args: {
    skip: number;
    take: number;
    rating?: number;
    packageId?: string;
    userId?: string;
  }): Promise<{ items: ReviewWithRelations[]; total: number }> {
    const where: Prisma.ReviewWhereInput = {
      deletedAt: null,
      ...(args.rating !== undefined ? { rating: args.rating } : {}),
      ...(args.packageId ? { wellnessPackageId: args.packageId } : {}),
      ...(args.userId ? { userId: args.userId } : {})
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.review.findMany({
        where,
        skip: args.skip,
        take: args.take,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          user: true,
          wellnessPackage: true
        }
      }),
      this.prisma.review.count({ where })
    ]);

    return { items, total };
  }

  async averageRating(args: {
    rating?: number;
    packageId?: string;
    userId?: string;
  }): Promise<number | null> {
    const aggregate = await this.prisma.review.aggregate({
      where: {
        deletedAt: null,
        ...(args.rating !== undefined ? { rating: args.rating } : {}),
        ...(args.packageId ? { wellnessPackageId: args.packageId } : {}),
        ...(args.userId ? { userId: args.userId } : {})
      },
      _avg: {
        rating: true
      }
    });

    return aggregate._avg.rating ?? null;
  }

  findById(id: string): Promise<ReviewWithRelations | null> {
    return this.prisma.review.findFirst({
      where: {
        id,
        deletedAt: null
      },
      include: {
        user: true,
        wellnessPackage: true
      }
    });
  }

  update(id: string, data: Prisma.ReviewUpdateInput): Promise<ReviewWithRelations> {
    return this.prisma.review.update({
      where: { id },
      data,
      include: {
        user: true,
        wellnessPackage: true
      }
    });
  }

  softDelete(id: string): Promise<Review> {
    return this.prisma.review.update({
      where: { id },
      data: {
        deletedAt: new Date()
      }
    });
  }

  userExists(id: string): Promise<boolean> {
    return this.prisma.user
      .findFirst({
        where: {
          id,
          deletedAt: null
        },
        select: { id: true }
      })
      .then((user) => user !== null);
  }

  packageExists(id: string): Promise<boolean> {
    return this.prisma.wellnessPackage
      .findFirst({
        where: {
          id,
          deletedAt: null
        },
        select: { id: true }
      })
      .then((wellnessPackage) => wellnessPackage !== null);
  }
}

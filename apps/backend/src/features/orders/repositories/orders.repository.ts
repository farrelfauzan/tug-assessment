import { Injectable } from '@nestjs/common';
import { Prisma, type OrderStatus, type PaymentProvider } from '@prisma/client';
import { PrismaService } from '../../../shared/prisma/prisma.service';

type OrderWithRelations = Prisma.OrderGetPayload<{
  include: {
    user: true;
    wellnessPackage: true;
    items: true;
    payment: true;
  };
}>;

@Injectable()
export class OrdersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: {
    userId: string;
    wellnessPackageId: string;
    quantity: number;
    paymentProvider: PaymentProvider;
  }) {
    return this.prisma.$transaction(async (tx) => {
      const wellnessPackage = await tx.wellnessPackage.findFirst({
        where: {
          id: input.wellnessPackageId,
          deletedAt: null,
          status: 'ACTIVE'
        }
      });

      if (!wellnessPackage) {
        return null;
      }

      const totalAmount = new Prisma.Decimal(wellnessPackage.price).mul(input.quantity);

      const order = await tx.order.create({
        data: {
          userId: input.userId,
          wellnessPackageId: input.wellnessPackageId,
          totalAmount,
          status: 'PENDING',
          items: {
            create: {
              wellnessPackageId: input.wellnessPackageId,
              quantity: input.quantity,
              unitPrice: wellnessPackage.price
            }
          },
          payment: {
            create: {
              userId: input.userId,
              amount: totalAmount,
              provider: input.paymentProvider,
              status: 'PENDING'
            }
          }
        },
        include: {
          user: true,
          wellnessPackage: true,
          items: true,
          payment: true
        }
      });

      return order;
    });
  }

  async list(args: {
    skip: number;
    take: number;
    status?: OrderStatus;
  }): Promise<{ items: OrderWithRelations[]; total: number }> {
    const where: Prisma.OrderWhereInput = {
      deletedAt: null,
      ...(args.status ? { status: args.status } : {})
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        where,
        skip: args.skip,
        take: args.take,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          user: true,
          wellnessPackage: true,
          items: true,
          payment: true
        }
      }),
      this.prisma.order.count({ where })
    ]);

    return { items, total };
  }

  findById(id: string) {
    return this.prisma.order.findFirst({
      where: {
        id,
        deletedAt: null
      },
      include: {
        user: true,
        wellnessPackage: true,
        items: true,
        payment: true
      }
    });
  }

  updateStatus(id: string, status: OrderStatus) {
    return this.prisma.order.update({
      where: { id },
      data: { status },
      include: {
        user: true,
        wellnessPackage: true,
        items: true,
        payment: true
      }
    });
  }
}

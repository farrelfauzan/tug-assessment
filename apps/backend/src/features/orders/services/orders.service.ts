import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import type {
  CreateOrderInput,
  ListOrdersQuery,
  UpdateOrderStatusInput
} from '@tug/api-schemas';
import { toPagination } from '@tug/utils';
import { Prisma, type OrderStatus, type PaymentProvider } from '@prisma/client';
import { OrdersRepository } from '../repositories/orders.repository';

type OrderWithRelations = Prisma.OrderGetPayload<{
  include: {
    user: true;
    wellnessPackage: true;
    items: true;
    payment: true;
  };
}>;

type OrderResponse = {
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
    description: string;
  };
  items: Array<{
    id: string;
    quantity: number;
    unitPrice: number;
  }>;
  status: OrderStatus;
  totalAmount: number;
  orderDate: string;
  payment: {
    id: string;
    provider: PaymentProvider;
    status: string;
    amount: number;
    transactionId: string | null;
  } | null;
  createdAt: string;
  updatedAt: string;
};

type RequestActor = {
  id: string;
  role: 'ADMIN' | 'USER';
};

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async create(input: CreateOrderInput & { userId: string }): Promise<OrderResponse> {
    const created = await this.ordersRepository.create({
      userId: input.userId,
      wellnessPackageId: input.wellnessPackageId,
      quantity: input.quantity,
      paymentProvider: input.paymentProvider
    });

    if (!created) {
      throw new NotFoundException('Wellness package not found or inactive');
    }

    return this.toResponse(created);
  }

  async list(query: ListOrdersQuery, actor: RequestActor): Promise<{
    items: OrderResponse[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const pagination = toPagination({ page: query.page, limit: query.limit });
    const { items, total } = await this.ordersRepository.list({
      skip: pagination.offset,
      take: pagination.limit,
      status: query.status,
      userId: actor.role === 'USER' ? actor.id : undefined
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

  async getById(id: string, actor: RequestActor): Promise<OrderResponse> {
    const order = await this.ordersRepository.findById(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (actor.role === 'USER' && order.user.id !== actor.id) {
      throw new NotFoundException('Order not found');
    }

    return this.toResponse(order);
  }

  async updateStatus(id: string, input: UpdateOrderStatusInput): Promise<OrderResponse> {
    const existing = await this.ordersRepository.findById(id);
    if (!existing) {
      throw new NotFoundException('Order not found');
    }

    if (!this.isValidTransition(existing.status, input.status)) {
      throw new BadRequestException(
        `Invalid status transition from ${existing.status} to ${input.status}`
      );
    }

    const updated = await this.ordersRepository.updateStatus(id, input.status);
    return this.toResponse(updated);
  }

  private isValidTransition(current: OrderStatus, next: OrderStatus): boolean {
    const transitions: Record<OrderStatus, OrderStatus[]> = {
      PENDING: ['CONFIRMED', 'CANCELLED'],
      CONFIRMED: ['SHIPPED', 'CANCELLED', 'REFUNDED'],
      SHIPPED: ['DELIVERED', 'REFUNDED'],
      DELIVERED: ['REFUNDED'],
      CANCELLED: [],
      REFUNDED: []
    };

    return transitions[current].includes(next);
  }

  private toResponse(order: OrderWithRelations): OrderResponse {
    return {
      id: order.id,
      user: {
        id: order.user.id,
        email: order.user.email,
        firstName: order.user.firstName,
        lastName: order.user.lastName
      },
      wellnessPackage: {
        id: order.wellnessPackage.id,
        name: order.wellnessPackage.name,
        description: order.wellnessPackage.description
      },
      items: order.items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        unitPrice: item.unitPrice.toNumber()
      })),
      status: order.status,
      totalAmount: order.totalAmount.toNumber(),
      orderDate: order.orderDate.toISOString(),
      payment: order.payment
        ? {
            id: order.payment.id,
            provider: order.payment.provider,
            status: order.payment.status,
            amount: order.payment.amount.toNumber(),
            transactionId: order.payment.transactionId
          }
        : null,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString()
    };
  }
}

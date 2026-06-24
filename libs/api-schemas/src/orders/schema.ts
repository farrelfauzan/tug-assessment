import { z } from 'zod';

export const orderStatusSchema = z.enum([
  'PENDING',
  'CONFIRMED',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
  'REFUNDED'
]);

export const paymentProviderSchema = z.enum([
  'STRIPE',
  'PAYPAL',
  'CREDIT_CARD',
  'BANK_TRANSFER'
]);

export const createOrderSchema = z.object({
  wellnessPackageId: z.string().uuid(),
  quantity: z.number().int().min(1).default(1),
  paymentProvider: paymentProviderSchema.default('STRIPE')
});

export const listOrdersQuerySchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  status: orderStatusSchema.optional()
});

export const orderIdSchema = z.object({
  id: z.string().uuid()
});

export const updateOrderStatusSchema = z.object({
  status: orderStatusSchema
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type ListOrdersQuery = z.infer<typeof listOrdersQuerySchema>;
export type OrderIdInput = z.infer<typeof orderIdSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;

import {
  createOrderSchema,
  listOrdersQuerySchema,
  orderIdSchema,
  updateOrderStatusSchema,
  type CreateOrderInput,
  type ListOrdersQuery,
  type OrderIdInput,
  type UpdateOrderStatusInput
} from '@tug/api-schemas';
import { createZodDto } from 'nestjs-zod';

export class CreateOrderDto extends createZodDto(createOrderSchema) {}
export class ListOrdersQueryDto extends createZodDto(listOrdersQuerySchema) {}
export class OrderIdDto extends createZodDto(orderIdSchema) {}
export class UpdateOrderStatusDto extends createZodDto(updateOrderStatusSchema) {}

export type CreateOrderDtoType = CreateOrderInput;
export type ListOrdersQueryDtoType = ListOrdersQuery;
export type OrderIdDtoType = OrderIdInput;
export type UpdateOrderStatusDtoType = UpdateOrderStatusInput;

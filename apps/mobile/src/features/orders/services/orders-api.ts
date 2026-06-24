import { api } from '../../../services/api';
import type { CreateOrderPayload, OrderListItem, OrdersListResponse } from '../types/order-types';

type ApiEnvelope<TData> = {
  success: boolean;
  data: TData;
};

export async function fetchOrders(): Promise<OrdersListResponse> {
  const response = await api.get<ApiEnvelope<OrdersListResponse>>('/orders');
  return response.data.data;
}

export async function fetchOrderDetail(orderId: string): Promise<OrderListItem> {
  const response = await api.get<ApiEnvelope<OrderListItem>>(`/orders/${orderId}`);
  return response.data.data;
}

export async function createOrder(payload: CreateOrderPayload): Promise<OrderListItem> {
  const response = await api.post<ApiEnvelope<OrderListItem>>('/orders', payload);
  return response.data.data;
}

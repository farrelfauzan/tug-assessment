import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createOrder, fetchOrderDetail, fetchOrders } from '../services/orders-api';
import type { CreateOrderPayload } from '../types/order-types';

export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders
  });
}

export function useOrderDetail(orderId: string) {
  return useQuery({
    queryKey: ['orders', orderId],
    queryFn: () => fetchOrderDetail(orderId),
    enabled: orderId.length > 0
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => createOrder(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['orders'] });
    }
  });
}

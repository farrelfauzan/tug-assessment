import { api } from '../../../lib/api';

type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type OrderItem = {
  id: string;
  status: string;
  totalAmount: number;
  orderDate: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  wellnessPackage: {
    name: string;
  };
};

export type OrdersList = {
  items: OrderItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export async function listOrders(): Promise<OrdersList> {
  const response = await api.get<ApiSuccess<OrdersList>>('/orders');
  return response.data.data;
}

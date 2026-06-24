export type OrderListItem = {
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
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
  totalAmount: number;
  orderDate: string;
  payment: {
    id: string;
    provider: 'STRIPE' | 'PAYPAL' | 'CREDIT_CARD' | 'BANK_TRANSFER';
    status: string;
    amount: number;
    transactionId: string | null;
  } | null;
  createdAt: string;
  updatedAt: string;
};

export type OrdersListResponse = {
  items: OrderListItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type CreateOrderPayload = {
  wellnessPackageId: string;
  quantity: number;
  paymentProvider: 'STRIPE' | 'PAYPAL' | 'CREDIT_CARD' | 'BANK_TRANSFER';
};

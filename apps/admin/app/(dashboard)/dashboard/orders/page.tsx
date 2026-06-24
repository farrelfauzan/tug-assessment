'use client';

import { useQuery } from '@tanstack/react-query';
import { listOrders } from '../../../../features/orders/services/orders.service';

export default function OrdersPage(): JSX.Element {
  const query = useQuery({
    queryKey: ['orders'],
    queryFn: listOrders
  });

  if (query.isPending) {
    return <section className="state">Loading orders...</section>;
  }

  if (query.isError) {
    return <section className="state">Failed to load orders.</section>;
  }

  if (query.data.items.length === 0) {
    return <section className="state">No orders available.</section>;
  }

  return (
    <section className="state">
      <h1 className="title" style={{ fontSize: '1.4rem' }}>
        Orders
      </h1>
      <p className="muted">Total: {query.data.pagination.total}</p>
      <ul>
        {query.data.items.map((order) => (
          <li key={order.id}>
            <strong>{order.user.firstName} {order.user.lastName}</strong> - {order.wellnessPackage.name}{' '}
            (${order.totalAmount.toFixed(2)}) [{order.status}]
          </li>
        ))}
      </ul>
    </section>
  );
}

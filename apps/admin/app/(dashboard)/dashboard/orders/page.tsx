'use client';

import { useQuery } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../../../../components/ui/table';
import { listOrders } from '../../../../features/orders/services/orders.service';

export default function OrdersPage(): JSX.Element {
  const query = useQuery({
    queryKey: ['orders'],
    queryFn: listOrders
  });

  if (query.isPending) {
    return <section className="rounded-lg border border-border bg-card p-6">Loading orders...</section>;
  }

  if (query.isError) {
    return <section className="rounded-lg border border-border bg-card p-6">Failed to load orders.</section>;
  }

  if (query.data.items.length === 0) {
    return <section className="rounded-lg border border-border bg-card p-6">No orders available.</section>;
  }

  return (
    <section className="rounded-lg border border-border bg-card p-6 text-card-foreground">
      <h1 className="text-xl font-semibold">Orders</h1>
      <p className="text-sm text-muted-foreground">Total: {query.data.pagination.total}</p>
      <div className="mt-3">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Package</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {query.data.items.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">
                  {order.user.firstName} {order.user.lastName}
                </TableCell>
                <TableCell>{order.wellnessPackage.name}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell className="text-right">${order.totalAmount.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}

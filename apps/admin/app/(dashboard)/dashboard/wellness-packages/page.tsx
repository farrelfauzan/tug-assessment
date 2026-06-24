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
import { listWellnessPackages } from '../../../../features/wellness-packages/services/wellness-packages.service';

export default function WellnessPackagesPage(): JSX.Element {
  const query = useQuery({
    queryKey: ['wellness-packages'],
    queryFn: listWellnessPackages
  });

  if (query.isPending) {
    return <section className="rounded-lg border border-border bg-card p-6">Loading wellness packages...</section>;
  }

  if (query.isError) {
    return <section className="rounded-lg border border-border bg-card p-6">Failed to load wellness packages.</section>;
  }

  if (query.data.items.length === 0) {
    return <section className="rounded-lg border border-border bg-card p-6">No wellness packages found.</section>;
  }

  return (
    <section className="rounded-lg border border-border bg-card p-6 text-card-foreground">
      <h1 className="text-xl font-semibold">Wellness Packages</h1>
      <p className="text-sm text-muted-foreground">Total: {query.data.pagination.total}</p>
      <div className="mt-3">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead className="text-right">Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {query.data.items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell>{item.durationWeeks} weeks</TableCell>
                <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}

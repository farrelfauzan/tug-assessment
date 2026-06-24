'use client';

import { useForm } from '@tanstack/react-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { z } from 'zod';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../../../../components/ui/table';
import {
  createWellnessPackage,
  listWellnessPackages
} from '../../../../features/wellness-packages/services/wellness-packages.service';
import { showErrorToast, showSuccessToast } from '../../../../lib/toast';

const createPackageSchema = z.object({
  name: z.string().trim().min(3, 'Name must be at least 3 characters').max(100),
  description: z.string().trim().min(10, 'Description must be at least 10 characters').max(1000),
  price: z.coerce.number().positive('Price must be greater than 0'),
  durationWeeks: z.coerce.number().int('Duration must be an integer').min(1).max(52),
  status: z.enum(['DRAFT', 'ACTIVE'])
});

export default function WellnessPackagesPage(): JSX.Element {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['wellness-packages'],
    queryFn: listWellnessPackages
  });

  const createMutation = useMutation({
    mutationFn: createWellnessPackage,
    onSuccess: () => {
      showSuccessToast('Package created successfully');
      void queryClient.invalidateQueries({ queryKey: ['wellness-packages'] });
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        showErrorToast(error.response?.data?.message ?? 'Failed to create package');
        return;
      }

      showErrorToast('Failed to create package');
    }
  });

  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
      price: '',
      durationWeeks: '4',
      status: 'DRAFT' as 'DRAFT' | 'ACTIVE'
    },
    onSubmit: async ({ value }) => {
      const parsed = createPackageSchema.safeParse(value);
      if (!parsed.success) {
        showErrorToast(parsed.error.issues[0]?.message ?? 'Invalid package form');
        return;
      }

      await createMutation.mutateAsync(parsed.data);
    }
  });

  if (query.isPending) {
    return <section className="rounded-lg border border-border bg-card p-6">Loading wellness packages...</section>;
  }

  if (query.isError) {
    return <section className="rounded-lg border border-border bg-card p-6">Failed to load wellness packages.</section>;
  }

  return (
    <section className="space-y-4 text-card-foreground">
      <div className="rounded-lg border border-border bg-card p-6">
        <h1 className="text-xl font-semibold">Create Wellness Package</h1>
        <p className="text-sm text-muted-foreground">Admin can create package records from this form.</p>

        <form
          className="mt-4 grid gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            void form.handleSubmit();
          }}
        >
          <form.Field name="name">
            {(field) => (
              <label className="grid gap-1 text-sm">
                <span className="text-muted-foreground">Name</span>
                <Input value={field.state.value} onChange={(event) => field.handleChange(event.target.value)} />
              </label>
            )}
          </form.Field>

          <form.Field name="description">
            {(field) => (
              <label className="grid gap-1 text-sm">
                <span className="text-muted-foreground">Description</span>
                <textarea
                  className="min-h-24 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
              </label>
            )}
          </form.Field>

          <div className="grid gap-3 md:grid-cols-3">
            <form.Field name="price">
              {(field) => (
                <label className="grid gap-1 text-sm">
                  <span className="text-muted-foreground">Price (USD)</span>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />
                </label>
              )}
            </form.Field>

            <form.Field name="durationWeeks">
              {(field) => (
                <label className="grid gap-1 text-sm">
                  <span className="text-muted-foreground">Duration (weeks)</span>
                  <Input
                    type="number"
                    min="1"
                    max="52"
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />
                </label>
              )}
            </form.Field>

            <form.Field name="status">
              {(field) => (
                <label className="grid gap-1 text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <select
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value as 'DRAFT' | 'ACTIVE')}
                  >
                    <option value="DRAFT">DRAFT</option>
                    <option value="ACTIVE">ACTIVE</option>
                  </select>
                </label>
              )}
            </form.Field>
          </div>

          <Button type="submit" disabled={createMutation.isPending} className="w-fit">
            {createMutation.isPending ? 'Creating...' : 'Create Package'}
          </Button>
        </form>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-semibold">Wellness Packages</h2>
        <p className="text-sm text-muted-foreground">Total: {query.data.pagination.total}</p>
        <div className="mt-3">
          {query.data.items.length === 0 ? (
            <p className="text-sm text-muted-foreground">No wellness packages found.</p>
          ) : (
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
          )}
        </div>
      </div>
    </section>
  );
}

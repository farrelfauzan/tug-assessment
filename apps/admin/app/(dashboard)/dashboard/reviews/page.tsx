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
import { listReviews } from '../../../../features/reviews/services/reviews.service';

export default function ReviewsPage(): JSX.Element {
  const query = useQuery({
    queryKey: ['reviews'],
    queryFn: listReviews
  });

  if (query.isPending) {
    return <section className="rounded-lg border border-border bg-card p-6">Loading reviews...</section>;
  }

  if (query.isError) {
    return <section className="rounded-lg border border-border bg-card p-6">Failed to load reviews.</section>;
  }

  if (query.data.items.length === 0) {
    return <section className="rounded-lg border border-border bg-card p-6">No reviews available.</section>;
  }

  return (
    <section className="rounded-lg border border-border bg-card p-6 text-card-foreground">
      <h1 className="text-xl font-semibold">Reviews</h1>
      <p className="text-sm text-muted-foreground">
        Average rating: {query.data.averageRating ? query.data.averageRating.toFixed(1) : '-'}
      </p>
      <div className="mt-3">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Package</TableHead>
              <TableHead>Reviewer</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Comment</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {query.data.items.map((review) => (
              <TableRow key={review.id}>
                <TableCell className="font-medium">{review.wellnessPackage.name}</TableCell>
                <TableCell>
                  {review.user.firstName} {review.user.lastName}
                </TableCell>
                <TableCell>{review.rating}/5</TableCell>
                <TableCell className="max-w-[28ch] truncate">{review.comment ?? '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}

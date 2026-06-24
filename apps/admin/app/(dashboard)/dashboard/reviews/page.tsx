'use client';

import { useQuery } from '@tanstack/react-query';
import { listReviews } from '../../../../features/reviews/services/reviews.service';

export default function ReviewsPage(): JSX.Element {
  const query = useQuery({
    queryKey: ['reviews'],
    queryFn: listReviews
  });

  if (query.isPending) {
    return <section className="state">Loading reviews...</section>;
  }

  if (query.isError) {
    return <section className="state">Failed to load reviews.</section>;
  }

  if (query.data.items.length === 0) {
    return <section className="state">No reviews available.</section>;
  }

  return (
    <section className="state">
      <h1 className="title" style={{ fontSize: '1.4rem' }}>
        Reviews
      </h1>
      <p className="muted">
        Average rating: {query.data.averageRating ? query.data.averageRating.toFixed(1) : '-'}
      </p>
      <ul>
        {query.data.items.map((review) => (
          <li key={review.id}>
            <strong>{review.wellnessPackage.name}</strong> - {review.rating}/5 by{' '}
            {review.user.firstName} {review.user.lastName}
          </li>
        ))}
      </ul>
    </section>
  );
}

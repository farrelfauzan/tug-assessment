'use client';

import { useQuery } from '@tanstack/react-query';
import { listWellnessPackages } from '../../../../features/wellness-packages/services/wellness-packages.service';

export default function WellnessPackagesPage(): JSX.Element {
  const query = useQuery({
    queryKey: ['wellness-packages'],
    queryFn: listWellnessPackages
  });

  if (query.isPending) {
    return <section className="state">Loading wellness packages...</section>;
  }

  if (query.isError) {
    return <section className="state">Failed to load wellness packages.</section>;
  }

  if (query.data.items.length === 0) {
    return <section className="state">No wellness packages found.</section>;
  }

  return (
    <section className="state">
      <h1 className="title" style={{ fontSize: '1.4rem' }}>
        Wellness Packages
      </h1>
      <p className="muted">Total: {query.data.pagination.total}</p>
      <ul>
        {query.data.items.map((item) => (
          <li key={item.id}>
            <strong>{item.name}</strong> - ${item.price.toFixed(2)} ({item.status})
          </li>
        ))}
      </ul>
    </section>
  );
}

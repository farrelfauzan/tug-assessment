import { useQuery } from '@tanstack/react-query';
import {
  fetchPackageReviews,
  fetchWellnessPackageById,
  fetchWellnessPackages
} from '../services/wellness-packages-api';

export function useWellnessPackages(search: string) {
  return useQuery({
    queryKey: ['wellness-packages', search],
    queryFn: () => fetchWellnessPackages(search),
    placeholderData: (previousData) => previousData
  });
}

export function useWellnessPackageDetail(packageId: string) {
  return useQuery({
    queryKey: ['wellness-packages', packageId],
    queryFn: () => fetchWellnessPackageById(packageId),
    enabled: packageId.length > 0
  });
}

export function usePackageReviews(packageId: string) {
  return useQuery({
    queryKey: ['reviews', packageId],
    queryFn: () => fetchPackageReviews(packageId),
    enabled: packageId.length > 0
  });
}

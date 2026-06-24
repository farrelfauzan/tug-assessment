import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createReview } from '../services/review-create-api';
import type { CreateReviewPayload } from '../services/review-create-api';

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateReviewPayload) => createReview(payload),
    onSuccess: (_, payload) => {
      void queryClient.invalidateQueries({ queryKey: ['reviews', payload.wellnessPackageId] });
    }
  });
}

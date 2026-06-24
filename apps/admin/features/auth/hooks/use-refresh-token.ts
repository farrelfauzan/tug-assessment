'use client';

import { useMutation } from '@tanstack/react-query';
import { showErrorToast } from '../../../lib/toast';
import { refresh } from '../services/auth.service';

export function useRefreshToken() {
  return useMutation({
    mutationFn: refresh,
    onSuccess: () => {
      // Session cookies are refreshed server-side by the backend.
    },
    onError: () => {
      showErrorToast('Session refresh failed. Please login again.');
    }
  });
}

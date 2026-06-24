'use client';

import { useMutation } from '@tanstack/react-query';
import { getRefreshToken, saveTokens } from '../../../lib/auth';
import { showToast } from '../../../lib/toast';
import { refresh } from '../services/auth.service';

export function useRefreshToken() {
  return useMutation({
    mutationFn: async () => {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token found');
      }

      return refresh(refreshToken);
    },
    onSuccess: (data) => {
      saveTokens(data.accessToken, data.refreshToken);
    },
    onError: () => {
      showToast('Session refresh failed. Please login again.');
    }
  });
}

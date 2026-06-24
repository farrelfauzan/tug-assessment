'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { clearTokens } from '../../lib/auth';
import { showToast } from '../../lib/toast';
import { logout } from '../../features/auth/services/auth.service';

export function LogoutButton(): JSX.Element {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clearTokens();
      showToast('Logged out');
      router.replace('/login');
    },
    onError: () => {
      clearTokens();
      router.replace('/login');
    }
  });

  return (
    <button
      type="button"
      className="button"
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
    >
      {mutation.isPending ? 'Signing out...' : 'Logout'}
    </button>
  );
}

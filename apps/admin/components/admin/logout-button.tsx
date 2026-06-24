'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { Button } from '../ui/button';
import { showErrorToast, showSuccessToast } from '../../lib/toast';
import { logout } from '../../features/auth/services/auth.service';

type LogoutButtonProps = {
  compact?: boolean;
};

export function LogoutButton({ compact = false }: LogoutButtonProps): JSX.Element {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      showSuccessToast('Logged out');
      router.replace('/login');
    },
    onError: () => {
      showErrorToast('Logout failed. Please try again.');
      router.replace('/login');
    }
  });

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full justify-center"
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
    >
      <LogOut className="mr-2 h-4 w-4" />
      {compact ? '' : mutation.isPending ? 'Signing out...' : 'Logout'}
    </Button>
  );
}

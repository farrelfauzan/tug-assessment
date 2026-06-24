import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { hasAccessTokenSession } from '../../lib/server-session';

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps): JSX.Element {
  if (hasAccessTokenSession()) {
    redirect('/dashboard');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6 text-foreground">
      {children}
    </div>
  );
}

import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { Sidebar } from '../../components/admin/sidebar';
import { SidebarProvider } from '../../components/ui/sidebar';
import { hasAccessTokenSession } from '../../lib/server-session';

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps): JSX.Element {
  if (!hasAccessTokenSession()) {
    redirect('/login');
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background text-foreground md:flex">
        <Sidebar />
        <section className="flex-1 p-4 md:p-6">{children}</section>
      </div>
    </SidebarProvider>
  );
}

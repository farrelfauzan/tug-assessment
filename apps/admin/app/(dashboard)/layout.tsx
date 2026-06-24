import type { ReactNode } from 'react';
import { LogoutButton } from '../../components/admin/logout-button';
import { Sidebar } from '../../components/admin/sidebar';

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps): JSX.Element {
  return (
    <div className="dashboard shell">
      <Sidebar />
      <section className="content">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <LogoutButton />
        </div>
        {children}
      </section>
    </div>
  );
}

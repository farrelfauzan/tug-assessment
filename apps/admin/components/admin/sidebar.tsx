'use client';

import { ClipboardList, HeartPulse, LayoutDashboard, Package, Star, UserRound } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar as AppSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { LogoutButton } from './logout-button';

const links = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/wellness-packages', label: 'Packages', icon: Package },
  { href: '/dashboard/orders', label: 'Orders', icon: ClipboardList },
  { href: '/dashboard/reviews', label: 'Reviews', icon: Star }
];

export function Sidebar(): JSX.Element {
  const pathname = usePathname();
  const { collapsed } = useSidebar();

  return (
    <AppSidebar>
      <SidebarHeader>
        <div className="group flex items-center justify-between gap-2">
          {collapsed ? (
            <div className="relative flex h-8 w-full items-center justify-center">
              <div className="flex items-center gap-2 transition-opacity duration-150 group-hover:opacity-0">
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <HeartPulse className="h-4 w-4" />
                </span>
              </div>

              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                <SidebarTrigger />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2 w-full">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <HeartPulse className="h-4 w-4" />
                </span>
                <p className="text-sm font-semibold text-foreground">Wellness Admin</p>
              </div>
              <SidebarTrigger />
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {links.map((link) => {
            const active = pathname === link.href
            const Icon = link.icon;
            return (
              <SidebarMenuItem key={link.href}>
                <Link href={link.href} className="block">
                  <SidebarMenuButton
                    asChild
                    isActive={active}
                    className={cn(collapsed ? 'justify-center px-2' : 'justify-start')}
                  >
                    <span className="flex items-center gap-2">
                      <Icon className="h-4 w-4 shrink-0" />
                      {!collapsed ? <span>{link.label}</span> : null}
                    </span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="space-y-2">
          <div className={cn('rounded-md border border-border p-2 text-xs text-muted-foreground', collapsed ? 'text-center' : '')}>
            <div className={cn('flex items-center gap-2', collapsed ? 'justify-center' : 'justify-start')}>
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-muted text-foreground">
                <UserRound className="h-4 w-4" />
              </span>
              {!collapsed ? (
                <div>
                  <p className="font-medium text-foreground">Admin Account</p>
                  <p>admin@example.com</p>
                </div>
              ) : null}
            </div>
          </div>
          <LogoutButton compact={collapsed} />
        </div>
      </SidebarFooter>
    </AppSidebar>
  );
}

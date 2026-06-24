'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { PanelLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

type SidebarContextValue = {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
};

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

function useSidebar(): SidebarContextValue {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider');
  }
  return context;
}

export { useSidebar };

export function SidebarProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [collapsed, setCollapsed] = React.useState(false);
  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>{children}</SidebarContext.Provider>
  );
}

export function Sidebar({ children }: { children: React.ReactNode }): JSX.Element {
  const { collapsed } = useSidebar();
  return (
    <aside
      className={cn(
        'hidden md:flex h-screen flex-col border-r border-border bg-card transition-all duration-300',
        collapsed ? 'w-20' : 'w-72'
      )}
    >
      {children}
    </aside>
  );
}

export function SidebarHeader({ children }: { children: React.ReactNode }): JSX.Element {
  return <div className="border-b border-border p-3">{children}</div>;
}

export function SidebarContent({ children }: { children: React.ReactNode }): JSX.Element {
  return <div className="flex-1 overflow-y-auto p-2">{children}</div>;
}

export function SidebarFooter({ children }: { children: React.ReactNode }): JSX.Element {
  return <div className="border-t border-border p-3">{children}</div>;
}

export function SidebarTrigger(): JSX.Element {
  const { collapsed, setCollapsed } = useSidebar();
  return (
    <Button
      variant="ghost"
      size="icon"
      type="button"
      aria-label="Toggle sidebar"
      onClick={() => setCollapsed((value) => !value)}
      title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
    >
      <PanelLeft className="h-4 w-4" />
    </Button>
  );
}

type SidebarTriggerInlineProps = {
  className?: string;
  collapsedLabel?: string;
  expandedLabel?: string;
};

export function SidebarTriggerInline({
  className,
  collapsedLabel = 'Expand sidebar',
  expandedLabel = 'Collapse sidebar'
}: SidebarTriggerInlineProps): JSX.Element {
  const { collapsed, setCollapsed } = useSidebar();
  return (
    <Button
      variant="ghost"
      size="sm"
      type="button"
      aria-label="Toggle sidebar"
      onClick={() => setCollapsed((value) => !value)}
      title={collapsed ? collapsedLabel : expandedLabel}
      className={cn('gap-2', className)}
    >
      <PanelLeft className="h-4 w-4" />
      <span>{collapsed ? collapsedLabel : expandedLabel}</span>
    </Button>
  );
}

export function SidebarMenu({ children }: { children: React.ReactNode }): JSX.Element {
  return <nav className="space-y-1">{children}</nav>;
}

export function SidebarMenuItem({ children }: { children: React.ReactNode }): JSX.Element {
  return <div>{children}</div>;
}

type SidebarMenuButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isActive?: boolean;
  asChild?: boolean;
};

export function SidebarMenuButton({
  children,
  className,
  isActive,
  asChild,
  ...props
}: SidebarMenuButtonProps): JSX.Element {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      className={cn(
        'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
        isActive && 'bg-muted text-foreground',
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/dashboard/wellness-packages', label: 'Packages' },
  { href: '/dashboard/orders', label: 'Orders' },
  { href: '/dashboard/reviews', label: 'Reviews' }
];

export function Sidebar(): JSX.Element {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <p className="sidebar-title">Wellness Admin</p>
      <nav className="nav">
        {links.map((link) => {
          const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link ${active ? 'active' : ''}`.trim()}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

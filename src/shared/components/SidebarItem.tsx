'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

export function SidebarItem({ href, icon, label, badge }:
{ href: string; icon: ReactNode; label: string; badge?: ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));

  const base = 'group relative flex items-center gap-2.5 h-9 px-3 rounded-lg text-sm '
    + 'transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 '
    + 'focus-visible:ring-content/30 focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar';
  const state = isActive
    ? 'bg-gradient-to-r from-item via-item/70 to-transparent text-content font-medium'
    : 'text-altwhite/85 hover:bg-item/70 hover:text-content';

  return (
    <Link href={href} className={`${base} ${state}`}>
      {isActive && (
        <span className="absolute left-1 top-1.5 bottom-1.5 w-[3px] rounded-full bg-content" />
      )}
      <span className="h-[1.125rem] w-[1.125rem] flex items-center justify-center opacity-80 group-hover:opacity-100">
        {icon}
      </span>
      <span className="flex-1 truncate">{label}</span>
      {badge}
    </Link>
  );
}

'use client';
import {
  TbLayoutDashboard, TbChartBar, TbSettings, TbUsersGroup, TbDownload, TbCoin,
} from 'react-icons/tb';

import { SidebarItem } from '@/shared/components/SidebarItem';

interface NavItem { href: string; label: string; icon: React.ReactNode }
interface Section { label: string; items: NavItem[] }

const SECTIONS: Section[] = [
  {
    label: 'Overview',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: <TbLayoutDashboard /> },
      { href: '/stats', label: 'Stats', icon: <TbChartBar /> },
    ],
  },
  {
    label: 'Manage',
    items: [
      { href: '/groups', label: 'Groups & Plans', icon: <TbUsersGroup /> },
      { href: '/imports', label: 'Imports', icon: <TbDownload /> },
      { href: '/cashout', label: 'Cash-out', icon: <TbCoin /> },
    ],
  },
  {
    label: 'System',
    items: [
      { href: '/settings', label: 'Settings', icon: <TbSettings /> },
    ],
  },
];

export function Sidebar() {
  return (
    <nav className="h-full bg-sidebar flex flex-col gap-5 px-3 py-4 overflow-y-auto">
      {SECTIONS.map((section) => (
        <div key={section.label} className="flex flex-col gap-1">
          <span className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-altwhite/40">
            {section.label}
          </span>
          {section.items.map((item) => (
            <SidebarItem key={item.href} href={item.href} icon={item.icon} label={item.label} />
          ))}
        </div>
      ))}
    </nav>
  );
}

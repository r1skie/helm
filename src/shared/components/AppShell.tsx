'use client';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import type { ReactNode } from 'react';

import { Sidebar } from '@/shared/components/Sidebar';
import { StatusBar } from '@/shared/components/StatusBar';
import { Titlebar } from '@/shared/components/Titlebar';

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div className="grid grid-rows-[2.5rem_1fr_1.5rem] h-screen w-screen overflow-hidden bg-base">
      <Titlebar onToggleSidebar={() => setCollapsed((c) => !c)} />
      <div className={'grid min-h-0 transition-[grid-template-columns] duration-200 '
        + `ease-[var(--ease-out-expo)] ${collapsed ? 'grid-cols-[0px_1fr]' : 'grid-cols-[15.5rem_1fr]'}`}>
        <div className="overflow-hidden min-h-0">
          <div className="w-[15.5rem] h-full">
            <Sidebar />
          </div>
        </div>
        <main className="flex-1 min-h-0 overflow-y-auto bg-base relative">
          <div aria-hidden className="pointer-events-none absolute inset-0
            bg-[radial-gradient(circle_at_50%_-20%,rgb(255_255_255/0.04),transparent_50%)]" />
          <div key={pathname} className="relative h-full animate-[pageEnter_180ms_ease-out]">
            <div className="mx-auto max-w-6xl px-8 py-8">{children}</div>
          </div>
        </main>
      </div>
      <StatusBar />
    </div>
  );
}

'use client';
import { useEffect, useState } from 'react';
import { TbCircleFilled, TbPalette } from 'react-icons/tb';

import { IS_MOCK } from '@/shared/lib/api';
import { useSessionStore } from '@/shared/stores/sessionStore';
import { THEMES, useThemeStore } from '@/shared/stores/themeStore';

export function StatusBar() {
  const [mounted, setMounted] = useState(false);
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const tenant = useSessionStore((s) => s.tenant);

  useEffect(() => setMounted(true), []);

  const cycleTheme = () => {
    const i = THEMES.indexOf(theme);
    setTheme(THEMES[(i + 1) % THEMES.length]);
  };

  if (!mounted) return <footer className="border-t border-border/40 bg-sidebar/95" />;

  return (
    <footer className="flex items-center justify-between border-t border-border/40 bg-sidebar/95
      px-3 text-[11px] font-medium leading-none text-altwhite/70 select-none">
      <div className="flex items-center gap-3 divide-x divide-border/30">
        <span className="flex items-center gap-1.5 pr-3">
          <TbCircleFilled className={IS_MOCK ? 'text-warning text-[8px]' : 'text-success text-[8px]'} />
          {IS_MOCK ? 'Mock data' : 'Connected'}
        </span>
        {tenant && (
          <span className="pl-0 flex items-center gap-1.5">
            <span className="uppercase tracking-wide">{tenant.status}</span>
          </span>
        )}
      </div>
      <button onClick={cycleTheme}
        className="flex items-center gap-1.5 hover:text-content transition-colors capitalize">
        <TbPalette /> {theme}
      </button>
    </footer>
  );
}

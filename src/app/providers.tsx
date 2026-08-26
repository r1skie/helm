'use client';
import { MotionConfig } from 'motion/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import type { ReactNode } from 'react';

import { AppShell } from '@/shared/components/AppShell';
import { ToastRegion } from '@/shared/components/ui/ToastRegion';
import { useUpdater } from '@/shared/hooks/useUpdater';
import { useSessionStore } from '@/shared/stores/sessionStore';
import { useThemeStore } from '@/shared/stores/themeStore';

export function Providers({ children }: { children: ReactNode }) {
  const hydrateTheme = useThemeStore((s) => s.hydrate);
  const hydrateSession = useSessionStore((s) => s.hydrate);
  const sessionHydrated = useSessionStore((s) => s.hydrated);
  const activated = useSessionStore((s) => s.activated);
  const router = useRouter();
  const pathname = usePathname();

  useUpdater();

  useEffect(() => {
    hydrateTheme();
    hydrateSession();
  }, [hydrateTheme, hydrateSession]);

  // Route guard: unauthenticated → /activate; authenticated on /activate → /dashboard.
  useEffect(() => {
    if (!sessionHydrated) return;
    if (!activated && pathname !== '/activate') router.replace('/activate');
    if (activated && (pathname === '/activate' || pathname === '/')) router.replace('/dashboard');
  }, [sessionHydrated, activated, pathname, router]);

  const onActivate = pathname === '/activate';

  return (
    <MotionConfig reducedMotion="user">
      {onActivate ? children : <AppShell>{children}</AppShell>}
      <ToastRegion />
    </MotionConfig>
  );
}

'use client';
import { useEffect } from 'react';

import { isTauri } from '@/shared/lib/tauri';
import { toast } from '@/shared/stores/toastStore';

// On launch (Tauri only): check the signed update endpoint, download+install, then relaunch.
// Everything is swallowed — offline, no release yet, or a browser preview must never block the app.
export function useUpdater(): void {
  useEffect(() => {
    if (!isTauri()) return;
    let cancelled = false;
    void (async () => {
      try {
        const { check } = await import('@tauri-apps/plugin-updater');
        const update = await check();
        if (!update || cancelled) return;
        toast.info('Update available', `Downloading v${update.version}…`);
        await update.downloadAndInstall();
        toast.success('Update installed', 'Restarting…');
        const { relaunch } = await import('@tauri-apps/plugin-process');
        await relaunch();
      } catch {
        /* no-op */
      }
    })();
    return () => { cancelled = true; };
  }, []);
}

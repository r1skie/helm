// Tauri shim — works in a plain browser (for `pnpm dev` preview) and inside the Tauri window.
// Window controls no-op in the browser; HWID falls back to a stable per-browser id.

interface TauriGlobal {
  core?: { invoke: <T>(cmd: string, args?: Record<string, unknown>) => Promise<T> };
  window?: { getCurrentWindow: () => { minimize: () => void; toggleMaximize: () => void; close: () => void } };
}

function tauri(): TauriGlobal | null {
  if (typeof window === 'undefined') return null;
  // Tauri v2 exposes __TAURI__ when withGlobalTauri is enabled.
  const g = (window as unknown as { __TAURI__?: TauriGlobal }).__TAURI__;
  return g ?? null;
}

export function isTauri(): boolean {
  return tauri() !== null;
}

const HWID_KEY = 'helm:hwid';

function browserHwid(): string {
  if (typeof window === 'undefined') return 'ssr';
  try {
    let id = window.localStorage.getItem(HWID_KEY);
    if (!id) {
      id = 'web-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
      window.localStorage.setItem(HWID_KEY, id);
    }
    return id;
  } catch {
    return 'web-ephemeral';
  }
}

export async function getHwid(): Promise<string> {
  const t = tauri();
  if (t?.core) {
    try {
      return await t.core.invoke<string>('get_hwid');
    } catch {
      /* fall through to browser id */
    }
  }
  return browserHwid();
}

export const windowControls = {
  minimize() {
    tauri()?.window?.getCurrentWindow().minimize();
  },
  toggleMaximize() {
    tauri()?.window?.getCurrentWindow().toggleMaximize();
  },
  close() {
    tauri()?.window?.getCurrentWindow().close();
  },
};

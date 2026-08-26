import { create } from 'zustand';

import { api, setAuthToken } from '@/shared/lib/api';
import { getHwid } from '@/shared/lib/tauri';
import type { TenantPublic } from '@/shared/types/api';

const KEY = 'helm:session';

interface Persisted {
  token: string;
  tenant: TenantPublic | null;
  expires_ts: number;
}

function load(): Persisted {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as Persisted;
  } catch { /* ignore */ }
  return { token: '', tenant: null, expires_ts: 0 };
}

function save(p: Persisted): void {
  try { window.localStorage.setItem(KEY, JSON.stringify(p)); } catch { /* ignore */ }
}

interface SessionState {
  token: string;
  tenant: TenantPublic | null;
  expiresTs: number;
  hydrated: boolean;
  activated: boolean;
  hydrate: () => void;
  activate: (licenseKey: string) => Promise<void>;
  logout: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  token: '',
  tenant: null,
  expiresTs: 0,
  hydrated: false,
  activated: false,
  hydrate: () => {
    const p = load();
    const valid = !!p.token && (!p.expires_ts || p.expires_ts * 1000 > Date.now());
    if (valid) setAuthToken(p.token);
    set({
      token: valid ? p.token : '',
      tenant: valid ? p.tenant : null,
      expiresTs: valid ? p.expires_ts : 0,
      activated: valid,
      hydrated: true,
    });
  },
  activate: async (licenseKey: string) => {
    const hwid = await getHwid();
    const res = await api.activate(licenseKey, hwid);
    setAuthToken(res.token);
    save({ token: res.token, tenant: res.tenant, expires_ts: res.expires_ts });
    set({ token: res.token, tenant: res.tenant, expiresTs: res.expires_ts, activated: true });
  },
  logout: () => {
    setAuthToken('');
    save({ token: '', tenant: null, expires_ts: 0 });
    set({ token: '', tenant: null, expiresTs: 0, activated: false });
  },
}));

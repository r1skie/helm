import { create } from 'zustand';

export type ThemeId = 'mono' | 'studio';
export const THEMES: ThemeId[] = ['mono', 'studio'];
const KEY = 'helm:theme';

function applyTheme(theme: ThemeId): void {
  if (typeof document === 'undefined') return;
  const el = document.documentElement;
  el.classList.remove('mono', 'studio');
  el.classList.add(theme);
}

interface ThemeState {
  theme: ThemeId;
  hydrated: boolean;
  setTheme: (t: ThemeId) => void;
  hydrate: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'mono',
  hydrated: false,
  setTheme: (t) => {
    applyTheme(t);
    try { window.localStorage.setItem(KEY, t); } catch { /* ignore */ }
    set({ theme: t });
  },
  hydrate: () => {
    let t: ThemeId = 'mono';
    try {
      const saved = window.localStorage.getItem(KEY);
      if (saved === 'mono' || saved === 'studio') t = saved;
    } catch { /* ignore */ }
    applyTheme(t);
    set({ theme: t, hydrated: true });
  },
}));

import { create } from 'zustand';

export type ToastKind = 'info' | 'success' | 'warning' | 'error';

export interface Toast {
  id: number;
  kind: ToastKind;
  title: string;
  description?: string;
  durationMs?: number;
}

interface ToastState {
  toasts: Toast[];
  push: (t: Omit<Toast, 'id'>) => void;
  dismiss: (id: number) => void;
}

let _seq = 1;

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  push: (t) => {
    const id = _seq++;
    const toast: Toast = { id, durationMs: 4500, ...t };
    set({ toasts: [...get().toasts, toast] });
    if (toast.durationMs && toast.durationMs > 0) {
      setTimeout(() => get().dismiss(id), toast.durationMs);
    }
  },
  dismiss: (id) => set({ toasts: get().toasts.filter((x) => x.id !== id) }),
}));

export const toast = {
  info: (title: string, description?: string) =>
    useToastStore.getState().push({ kind: 'info', title, description }),
  success: (title: string, description?: string) =>
    useToastStore.getState().push({ kind: 'success', title, description }),
  warning: (title: string, description?: string) =>
    useToastStore.getState().push({ kind: 'warning', title, description }),
  error: (title: string, description?: string) =>
    useToastStore.getState().push({ kind: 'error', title, description }),
};

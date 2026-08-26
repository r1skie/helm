import type { ReactNode } from 'react';

type Tone = 'success' | 'active' | 'neutral' | 'warning' | 'danger';

const TONES: Record<Tone, string> = {
  success: 'bg-success/20 text-success',
  active: 'bg-dynamic/20 text-dynamic',
  neutral: 'bg-item ring-1 ring-border/40 text-altwhite/70',
  warning: 'bg-warning/20 text-warning',
  danger: 'bg-danger/20 text-danger',
};

export function StatusPill({ tone = 'neutral', pulse = false, children }:
{ tone?: Tone; pulse?: boolean; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold `
      + `${TONES[tone]} ${pulse ? 'animate-pulse' : ''}`}>
      {children}
    </span>
  );
}

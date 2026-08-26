import type { ReactNode } from 'react';

export function PageHeader({ title, subtitle, actions }:
{ title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-content">{title}</h1>
        {subtitle && <p className="text-sm text-altwhite/70">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}

export function SectionHeader({ eyebrow, title }: { eyebrow?: string; title: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      {eyebrow && (
        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-altwhite/50">
          {eyebrow}
        </span>
      )}
      <span className="text-sm font-semibold text-content">{title}</span>
    </div>
  );
}

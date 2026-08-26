import type { ReactNode } from 'react';

export function EmptyState({ icon, title, description, action }:
{ icon?: ReactNode; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="surface flex flex-col items-center justify-center gap-4 p-16 text-center">
      {icon && <div className="text-3xl text-altwhite/50">{icon}</div>}
      <div className="flex flex-col gap-1">
        <div className="text-sm font-semibold text-content">{title}</div>
        {description && <div className="text-xs text-altwhite/60 max-w-sm">{description}</div>}
      </div>
      {action}
    </div>
  );
}

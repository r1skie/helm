import type { ReactNode } from 'react';

interface Props {
  icon?: ReactNode;
  label: string;
  value: ReactNode;
  hint?: string;
}

export function StatTile({ icon, label, value, hint }: Props) {
  return (
    <div className="surface-elev px-4 py-3.5 flex flex-col gap-1">
      <div className="flex items-center gap-2 text-altwhite/70">
        {icon}
        <span className="text-[10px] font-semibold uppercase tracking-[0.12em]">{label}</span>
      </div>
      <div className="text-2xl font-semibold tracking-tight text-content tabular-nums">{value}</div>
      {hint && <div className="text-[11px] text-altwhite/60">{hint}</div>}
    </div>
  );
}

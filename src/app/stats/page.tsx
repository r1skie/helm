'use client';
import { useEffect, useState } from 'react';

import { PageHeader, SectionHeader } from '@/shared/components/ui/SectionHeader';
import { api } from '@/shared/lib/api';
import type { StatsResponse } from '@/shared/types/api';

const money = (n: number) => `$${n.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

export default function StatsPage() {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  useEffect(() => { void api.stats().then(setStats).catch(() => undefined); }, []);

  const groups = stats ? Object.keys({ ...stats.active_by_group, ...stats.revenue_by_group }) : [];

  return (
    <div>
      <PageHeader title="Stats" subtitle="Revenue and membership by channel" />
      <div className="surface-elev p-5">
        <SectionHeader eyebrow="Breakdown" title="Per-channel" />
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-[0.1em] text-altwhite/50 border-b border-border/40">
                <th className="py-2 font-semibold">Channel</th>
                <th className="py-2 font-semibold text-right">Active subs</th>
                <th className="py-2 font-semibold text-right">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((g) => (
                <tr key={g} className="border-b border-border/20 last:border-0">
                  <td className="py-2.5 text-content">{g}</td>
                  <td className="py-2.5 text-right tabular-nums text-altwhite/80">
                    {stats?.active_by_group[g] ?? 0}
                  </td>
                  <td className="py-2.5 text-right tabular-nums text-content">
                    {money(stats?.revenue_by_group[g] ?? 0)}
                  </td>
                </tr>
              ))}
              {groups.length === 0 && (
                <tr><td colSpan={3} className="py-6 text-center text-altwhite/50">Loading…</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

'use client';
import { useEffect, useState } from 'react';
import {
  TbUsers, TbUserCheck, TbCoin, TbActivity, TbRefresh, TbServer,
} from 'react-icons/tb';

import { Button } from '@/shared/components/ui/Button';
import { PageHeader, SectionHeader } from '@/shared/components/ui/SectionHeader';
import { StatTile } from '@/shared/components/ui/StatTile';
import { StatusPill } from '@/shared/components/ui/StatusPill';
import { api } from '@/shared/lib/api';
import { toast } from '@/shared/stores/toastStore';
import type { StatsResponse, StatusResponse } from '@/shared/types/api';

const money = (n: number) => `$${n.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

export default function DashboardPage() {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [restarting, setRestarting] = useState(false);

  const load = () => {
    void api.stats().then(setStats).catch(() => toast.error('Failed to load stats'));
    void api.status().then(setStatus).catch(() => undefined);
  };
  useEffect(load, []);

  const restart = async () => {
    setRestarting(true);
    try { await api.runAction('restart'); toast.success('Restart triggered'); load(); }
    catch { toast.error('Restart failed'); }
    finally { setRestarting(false); }
  };

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Your bot at a glance"
        actions={<Button variant="outlined" size="sm" onClick={() => void restart()} loading={restarting}>
          <TbRefresh /> Restart
        </Button>} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatTile icon={<TbUsers />} label="Members" value={stats?.members ?? '—'} />
        <StatTile icon={<TbUserCheck />} label="Paid users" value={stats?.paid_users ?? '—'} />
        <StatTile icon={<TbActivity />} label="Active subs"
          value={stats?.active_subscriptions ?? '—'} />
        <StatTile icon={<TbCoin />} label="Revenue"
          value={stats ? money(stats.revenue_usd) : '—'} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="surface-elev p-5 flex flex-col gap-4">
          <SectionHeader eyebrow="Runtime" title="Container status" />
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm text-altwhite/80">
              <TbServer /> Bot process
            </span>
            <StatusPill tone={status?.container === 'running' ? 'success' : 'neutral'}
              pulse={status?.container === 'running'}>
              {status?.container ?? '—'}
            </StatusPill>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-altwhite/80">Entitlement</span>
            <span className="text-sm text-content tabular-nums">
              {status?.active_until
                ? new Date(status.active_until * 1000).toLocaleDateString()
                : '—'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-altwhite/80">Tier</span>
            <StatusPill tone="active">{(status?.tier ?? '—').toUpperCase()}</StatusPill>
          </div>
        </div>

        <div className="surface-elev p-5 flex flex-col gap-4">
          <SectionHeader eyebrow="Background work" title="Jobs" />
          <div className="grid grid-cols-2 gap-3">
            {stats && Object.entries(stats.jobs).map(([k, v]) => (
              <div key={k} className="surface-soft px-3 py-2.5 flex flex-col gap-0.5">
                <span className="text-[10px] uppercase tracking-[0.1em] text-altwhite/50">{k}</span>
                <span className="text-lg font-semibold tabular-nums text-content">{v}</span>
              </div>
            ))}
            {!stats && <span className="text-sm text-altwhite/50">Loading…</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

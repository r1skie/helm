'use client';
import { useEffect, useState } from 'react';
import { TbDownload, TbCloudDownload, TbLink } from 'react-icons/tb';

import { Button } from '@/shared/components/ui/Button';
import { PageHeader, SectionHeader } from '@/shared/components/ui/SectionHeader';
import { StatTile } from '@/shared/components/ui/StatTile';
import { StatusPill } from '@/shared/components/ui/StatusPill';
import { api } from '@/shared/lib/api';
import { toast } from '@/shared/stores/toastStore';
import type { ImportsResponse } from '@/shared/types/api';

const KINDS = [
  { key: 'mega_import', label: 'MEGA folder', icon: <TbCloudDownload /> },
  { key: 'link_import', label: 'Link / URL', icon: <TbLink /> },
];

export default function ImportsPage() {
  const [data, setData] = useState<ImportsResponse | null>(null);
  const [kind, setKind] = useState('mega_import');
  const [source, setSource] = useState('');
  const [target, setTarget] = useState('');
  const [busy, setBusy] = useState(false);

  const load = () => { void api.imports().then(setData).catch(() => undefined); };
  useEffect(() => {
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, []);

  const enqueue = async () => {
    if (!source.trim() || !target.trim()) { toast.warning('Source and target required'); return; }
    setBusy(true);
    try {
      const r = await api.enqueueImport(kind, source.trim(), Number(target.trim()));
      toast.success('Import queued', `Job #${r.job_id}`);
      setSource('');
      load();
    } catch { toast.error('Enqueue failed'); }
    finally { setBusy(false); }
  };

  const b = data?.broker;

  return (
    <div>
      <PageHeader title="Imports" subtitle="Bulk content imports run through a global fair queue" />

      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatTile label="Running" value={b ? `${b.running}/${b.cap}` : '—'} hint="host-wide slots" />
        <StatTile label="Queued" value={b?.queued ?? '—'} hint="waiting tenants" />
        <StatTile label="Your tier" value={b && b.running_tenants.includes('demo-tenant')
          ? 'active' : 'idle'} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="surface-elev p-5 flex flex-col gap-4">
          <SectionHeader eyebrow="New" title="Queue an import" />
          <div className="flex gap-2">
            {KINDS.map((k) => (
              <button key={k.key} onClick={() => setKind(k.key)}
                className={`flex-1 flex items-center justify-center gap-2 h-10 rounded-lg text-sm
                  transition-colors ${kind === k.key
                    ? 'bg-content text-base font-medium'
                    : 'surface-soft text-altwhite hover:text-content'}`}>
                {k.icon} {k.label}
              </button>
            ))}
          </div>
          <input value={source} onChange={(e) => setSource(e.target.value)}
            placeholder={kind === 'mega_import' ? 'MEGA folder link' : 'https://…'}
            className="surface-soft px-3 h-10 rounded-lg bg-transparent outline-none text-sm
              text-content placeholder:text-altwhite/40 focus:ring-2 focus:ring-content/30" />
          <input value={target} onChange={(e) => setTarget(e.target.value)}
            placeholder="Target chat id (e.g. -1002345678901)"
            className="surface-soft px-3 h-10 rounded-lg bg-transparent outline-none text-sm
              text-content placeholder:text-altwhite/40 font-mono focus:ring-2 focus:ring-content/30" />
          <Button onClick={() => void enqueue()} loading={busy}>
            <TbDownload /> Queue import
          </Button>
        </div>

        <div className="surface-elev p-5 flex flex-col gap-4">
          <SectionHeader eyebrow="Live" title="Current jobs" />
          {KINDS.map((k) => {
            const s = data?.imports[k.key];
            const last = s?.last;
            return (
              <div key={k.key} className="surface-soft px-3 py-3 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm text-content">{k.icon} {k.label}</span>
                  {s?.pending_or_running
                    ? <StatusPill tone="active" pulse>active</StatusPill>
                    : <StatusPill tone="neutral">idle</StatusPill>}
                </div>
                {last?.phase === 'queued' && (
                  <span className="text-[11px] text-warning/80">
                    Waiting — queue position {last.queue_position ?? '?'}
                  </span>
                )}
                {last?.phase === 'running' && last.total ? (
                  <div className="flex flex-col gap-1">
                    <div className="h-1.5 rounded-full bg-item overflow-hidden">
                      <div className="h-full bg-content"
                        style={{ width: `${Math.round(100 * (last.posted ?? 0) / last.total)}%` }} />
                    </div>
                    <span className="text-[11px] text-altwhite/60 tabular-nums">
                      {last.posted ?? 0} / {last.total}
                    </span>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

'use client';
import { useEffect, useState } from 'react';
import { TbHash, TbUsersGroup } from 'react-icons/tb';

import { PageHeader } from '@/shared/components/ui/SectionHeader';
import { StatusPill } from '@/shared/components/ui/StatusPill';
import { EmptyState } from '@/shared/components/ui/EmptyState';
import { api } from '@/shared/lib/api';
import type { Group } from '@/shared/types/api';

const money = (n?: number) => (n == null ? '—' : `$${n}`);

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[] | null>(null);
  useEffect(() => { void api.groups().then((r) => setGroups(r.groups)).catch(() => setGroups([])); }, []);

  return (
    <div>
      <PageHeader title="Groups & Plans" subtitle="Your channels and their subscription plans" />
      {groups && groups.length === 0 && (
        <EmptyState icon={<TbUsersGroup />} title="No channels yet"
          description="Channels you create in the bot appear here with their plans." />
      )}
      <div className="flex flex-col gap-4">
        {groups?.map((g) => {
          const key = (g.group_key || g.key || '') as string;
          const role = (g.role as string) || 'paid';
          return (
            <div key={key} className="surface-elev p-5 flex flex-col gap-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-semibold text-content">{g.name || key}</span>
                    <StatusPill tone={role === 'free' ? 'neutral' : 'active'}>{role}</StatusPill>
                    {!g.active && <StatusPill tone="warning">hidden</StatusPill>}
                  </div>
                  <span className="flex items-center gap-1 text-[11px] text-altwhite/50 font-mono">
                    <TbHash /> {g.chat_id ?? '—'}
                  </span>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {g.plans.length === 0 && (
                  <span className="text-sm text-altwhite/50">No plans</span>
                )}
                {g.plans.map((p, i) => (
                  <div key={i} className="surface-soft px-3 py-2.5 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-sm text-content">{p.label || p.plan_key}</span>
                      <span className="text-[11px] text-altwhite/50">
                        {p.lifetime ? 'Lifetime' : `${p.days ?? 0} days`}
                      </span>
                    </div>
                    <span className="text-sm font-semibold tabular-nums text-content">
                      {money(p.price_usd)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

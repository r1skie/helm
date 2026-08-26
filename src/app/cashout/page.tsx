'use client';
import { useEffect, useState } from 'react';
import { TbCoin, TbCurrencyBitcoin, TbStar } from 'react-icons/tb';

import { Button } from '@/shared/components/ui/Button';
import { PageHeader, SectionHeader } from '@/shared/components/ui/SectionHeader';
import { StatTile } from '@/shared/components/ui/StatTile';
import { api, ApiError } from '@/shared/lib/api';
import { toast } from '@/shared/stores/toastStore';
import type { CashoutResponse } from '@/shared/types/api';

const money = (n: number) => `$${n.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

export default function CashoutPage() {
  const [data, setData] = useState<CashoutResponse | null>(null);
  useEffect(() => { void api.cashout().then(setData).catch(() => undefined); }, []);

  const withdraw = async () => {
    try {
      await api.requestCashout();
      toast.success('Withdrawal requested');
    } catch (e) {
      const msg = e instanceof ApiError ? e.message
        : (data?.note ?? 'Withdrawals are handled by the operator for now.');
      toast.info('Operator-processed', msg);
    }
  };

  return (
    <div>
      <PageHeader title="Cash-out" subtitle="Withdraw your earnings" />
      <div className="grid sm:grid-cols-2 gap-3 mb-6">
        <StatTile icon={<TbCoin />} label="Available revenue"
          value={data ? money(data.revenue_usd) : '—'} />
        <StatTile label="Methods" value={data?.methods.length ?? '—'}
          hint={data?.methods.join(' · ')} />
      </div>

      <div className="surface-elev p-5 flex flex-col gap-4">
        <SectionHeader eyebrow="Withdraw" title="Choose a method" />
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="surface-soft p-4 flex flex-col gap-2">
            <span className="flex items-center gap-2 text-sm font-medium text-content">
              <TbCurrencyBitcoin /> Crypto
            </span>
            <span className="text-xs text-altwhite/60">Payout to your wallet via the operator.</span>
          </div>
          <div className="surface-soft p-4 flex flex-col gap-2">
            <span className="flex items-center gap-2 text-sm font-medium text-content">
              <TbStar /> Telegram Stars
            </span>
            <span className="text-xs text-altwhite/60">Converted and paid out manually.</span>
          </div>
        </div>
        <p className="text-[11px] text-altwhite/50">{data?.note}</p>
        <Button variant="outlined" onClick={() => void withdraw()}>Request withdrawal</Button>
      </div>
    </div>
  );
}

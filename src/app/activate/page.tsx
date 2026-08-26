'use client';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { TbKey, TbShieldCheck } from 'react-icons/tb';

import { Button } from '@/shared/components/ui/Button';
import { ApiError, IS_MOCK } from '@/shared/lib/api';
import { getHwid } from '@/shared/lib/tauri';
import { useSessionStore } from '@/shared/stores/sessionStore';
import { toast } from '@/shared/stores/toastStore';

export default function ActivatePage() {
  const activate = useSessionStore((s) => s.activate);
  const router = useRouter();
  const [key, setKey] = useState('');
  const [hwid, setHwid] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => { void getHwid().then(setHwid); }, []);

  const onSubmit = async () => {
    if (!key.trim()) { toast.warning('Enter your license key'); return; }
    setBusy(true);
    try {
      await activate(key.trim());
      toast.success('Activated', 'Welcome back.');
      router.replace('/dashboard');
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : 'Activation failed';
      toast.error('Activation failed', msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid h-screen w-screen place-items-center bg-base relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0
        bg-[radial-gradient(circle_at_50%_-10%,rgb(255_255_255/0.05),transparent_55%)]" />
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="surface-elev w-[26rem] p-8 flex flex-col gap-6 relative">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="h-12 w-12 rounded-xl bg-gradient-to-br from-content to-altwhite
            flex items-center justify-center text-lg font-bold text-base">H</span>
          <div>
            <h1 className="text-xl font-bold tracking-[0.2em] text-content">HELM</h1>
            <p className="text-xs text-altwhite/60 mt-1">Activate your license to continue</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-altwhite/60">
              License key
            </span>
            <div className="flex items-center gap-2 surface-soft px-3 h-11 rounded-lg
              focus-within:ring-2 focus-within:ring-content/30">
              <TbKey className="text-altwhite/50 shrink-0" />
              <input
                value={key} onChange={(e) => setKey(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') void onSubmit(); }}
                placeholder="XXXXX-XXXXX-XXXXX-XXXXX"
                className="flex-1 bg-transparent outline-none text-sm text-content
                  placeholder:text-altwhite/40 tracking-wider font-mono" />
            </div>
          </label>

          <div className="flex items-center gap-2 text-[11px] text-altwhite/50">
            <TbShieldCheck className="shrink-0" />
            <span className="truncate">Device ID: <span className="font-mono">{hwid || '…'}</span></span>
          </div>
        </div>

        <Button size="lg" loading={busy} onClick={() => void onSubmit()} className="w-full">
          Activate
        </Button>

        {IS_MOCK && (
          <p className="text-center text-[11px] text-warning/80">
            Mock mode — any key works. Set NEXT_PUBLIC_HELM_MOCK=0 to use a live control plane.
          </p>
        )}
      </motion.div>
    </div>
  );
}

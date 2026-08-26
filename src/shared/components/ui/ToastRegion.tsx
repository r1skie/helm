'use client';
import { AnimatePresence, motion } from 'motion/react';
import { TbAlertTriangle, TbCheck, TbInfoCircle, TbX } from 'react-icons/tb';

import { useToastStore } from '@/shared/stores/toastStore';
import type { ToastKind } from '@/shared/stores/toastStore';

const ICONS: Record<ToastKind, React.ReactNode> = {
  info: <TbInfoCircle />, success: <TbCheck />, warning: <TbAlertTriangle />, error: <TbX />,
};
const TONE: Record<ToastKind, string> = {
  info: 'text-info', success: 'text-success', warning: 'text-warning', error: 'text-danger',
};

export function ToastRegion() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-80">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div key={t.id}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="surface-elev p-3 flex items-start gap-3 shadow-lg">
            <span className={`mt-0.5 ${TONE[t.kind]}`}>{ICONS[t.kind]}</span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-content">{t.title}</div>
              {t.description && <div className="text-xs text-altwhite/70 mt-0.5">{t.description}</div>}
            </div>
            <button onClick={() => dismiss(t.id)}
              className="text-altwhite/50 hover:text-content transition-colors"><TbX /></button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

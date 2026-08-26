'use client';
import { TbMenu2, TbMinus, TbSquare, TbX } from 'react-icons/tb';

import { windowControls } from '@/shared/lib/tauri';
import { useSessionStore } from '@/shared/stores/sessionStore';

const BRAND = 'HELM';

export function Titlebar({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const tenant = useSessionStore((s) => s.tenant);

  const dragStyle = { WebkitAppRegion: 'drag' } as React.CSSProperties;
  const noDrag = { WebkitAppRegion: 'no-drag' } as React.CSSProperties;

  return (
    <header className="h-[2.5rem] flex items-center justify-between px-3 bg-sidebar/95 backdrop-blur-xl
      border-b border-border/40 z-30 select-none relative">
      <div aria-hidden className="absolute inset-0 z-0" data-tauri-drag-region style={dragStyle} />

      <div className="flex items-center gap-2 z-10" style={noDrag}>
        <button onClick={onToggleSidebar}
          className="h-7 w-7 flex items-center justify-center rounded-md text-altwhite hover:bg-item hover:text-content transition-colors">
          <TbMenu2 />
        </button>
        <div className="flex items-center gap-2">
          <span className="h-5 w-5 rounded-md bg-gradient-to-br from-content to-altwhite flex items-center
            justify-center text-[11px] font-bold text-base">H</span>
          <span className="text-sm font-semibold tracking-[0.2em] text-content">{BRAND}</span>
        </div>
      </div>

      <div className="flex items-center gap-1 z-10" style={noDrag}>
        {tenant && (
          <span className="mr-2 text-[11px] text-altwhite/60 tabular-nums">
            {tenant.id} · <span className="uppercase">{tenant.tier}</span>
          </span>
        )}
        <div className="mx-1 h-5 w-px bg-border/60" />
        <WinBtn onClick={windowControls.minimize}><TbMinus /></WinBtn>
        <WinBtn onClick={windowControls.toggleMaximize}><TbSquare className="text-[0.8em]" /></WinBtn>
        <button onClick={windowControls.close}
          className="h-7 w-7 flex items-center justify-center rounded-md text-altwhite
            hover:bg-danger/80 hover:text-base transition-colors">
          <TbX />
        </button>
      </div>
    </header>
  );
}

function WinBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      className="h-7 w-7 flex items-center justify-center rounded-md text-altwhite hover:bg-item hover:text-content transition-colors">
      {children}
    </button>
  );
}

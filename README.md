# HELM — desktop thin client

A veil-styled desktop control panel for a single tenant of the TGBot SaaS platform. It talks to the
**Control API** (`controlplane/control_api.py`) and holds nothing but a session token — all valuable
logic stays server-side.

Stack: Next.js 16 (App Router, static export) · React 19 · Tailwind v4 · zustand · motion.
Aesthetic ported from the "veil" project (OLED-black **Mono** theme + Steam-blue **Studio**, frosted
`.surface` panels, custom titlebar/sidebar shell). Brand name is the constant `BRAND` in
`src/shared/components/Titlebar.tsx` (and the "H" mark) — rename freely.

## Preview (no server needed)

```bash
pnpm install
pnpm dev            # http://localhost:3010
```

Runs in **mock mode** by default (`src/shared/lib/mock.ts`) so every screen is populated with sample
data and any license key activates. This is the fastest way to see the look.

## Point at a live control plane

```bash
NEXT_PUBLIC_HELM_MOCK=0 NEXT_PUBLIC_HELM_API_URL=http://127.0.0.1:9200 pnpm dev
```

`api.ts` then hits the real endpoints with the bearer token from activation.

## Screens → API

| Screen        | Endpoints |
|---------------|-----------|
| Activate      | `POST /api/activate` (license + HWID) |
| Dashboard     | `GET /api/stats`, `/api/status`, `POST /api/actions/restart` |
| Stats         | `GET /api/stats` (per-channel) |
| Groups & Plans| `GET /api/groups` |
| Imports       | `GET/POST /api/imports` (enqueue + FIFO queue position) |
| Cash-out      | `GET /api/cashout` |
| Settings      | `GET/PUT /api/settings` (schema-driven, secrets masked) |

## Build

```bash
pnpm build          # static export → ./out
```

## Next step — Tauri wrap

Not yet added. To make it the real desktop app (frameless transparent window, real HWID, NSIS/MSI +
minisign updater like veil):

1. `pnpm add -D @tauri-apps/cli && pnpm tauri init` (frontendDist `../out`, devUrl `http://localhost:3010`).
2. Window: `decorations:false, transparent:true`, 1280×800 — the custom `Titlebar`/`data-tauri-drag-region`
   are already in place.
3. Add a `get_hwid` `#[tauri::command]` (machine-uid) — `src/shared/lib/tauri.ts` already calls it and
   falls back to a browser id.
4. Enable `withGlobalTauri` so `window.__TAURI__` is present for the shim.

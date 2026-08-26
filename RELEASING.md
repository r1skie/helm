# Releasing HELM (signed auto-updates)

HELM ships a Tauri auto-updater. On launch it fetches the **update endpoint**, and if a newer signed
build exists it downloads, installs, and relaunches. Updates are verified with a **minisign** public key
baked into the app — only builds signed with the matching private key are ever accepted.

## Config (already set)

- **Public key**: `src-tauri/tauri.conf.json` → `plugins.updater.pubkey`.
- **Endpoint**: `plugins.updater.endpoints[0]` =
  `https://github.com/r1skie/helm/releases/latest/download/latest.json`
  (change `r1skie/helm` to the real repo before shipping; the `latest` release must carry a
  `latest.json` asset).
- **Install mode**: `passive` (Windows shows a minimal progress UI, no clicks).

## The signing key (CRITICAL — back it up)

- Private key: `src-tauri/.tauri-signing.key` — **git-ignored, never commit it.**
- Public key: `src-tauri/.tauri-signing.key.pub` (also the `pubkey` in config).
- It was generated **without a password** (`TAURI_SIGNING_PRIVATE_KEY_PASSWORD=""`).

**If you lose this key you cannot ship updates that existing installs will accept** — every user would
have to reinstall manually. Copy `.tauri-signing.key` somewhere safe (password manager / offline backup)
now. To rotate: `pnpm tauri signer generate -w src-tauri/.tauri-signing.key`, paste the new pubkey into
`tauri.conf.json`, and ship a new signed build (old installs must be updated once with the new key
embedded before the rotation takes effect).

## Cut a release

1. Bump `version` in `src-tauri/tauri.conf.json` (and `package.json`).
2. Build signed (the key must be in the env — it is **not** read from disk automatically):
   ```bash
   export TAURI_SIGNING_PRIVATE_KEY="$(cat src-tauri/.tauri-signing.key)"
   export TAURI_SIGNING_PRIVATE_KEY_PASSWORD=""
   pnpm tauri build --bundles nsis
   ```
   Output (under `src-tauri/target/release/bundle/nsis/`):
   - `HELM_<version>_x64-setup.exe`      ← the installer
   - `HELM_<version>_x64-setup.exe.sig`  ← its signature
3. Create a GitHub release tagged `v<version>` on the configured repo and upload **both** files above,
   plus a `latest.json` (below).

## `latest.json`

The `signature` value is the **entire contents** of the `.exe.sig` file for this build.

```json
{
  "version": "0.1.1",
  "notes": "What changed.",
  "pub_date": "2026-08-24T00:00:00Z",
  "platforms": {
    "windows-x86_64": {
      "signature": "<paste contents of HELM_0.1.1_x64-setup.exe.sig>",
      "url": "https://github.com/r1skie/helm/releases/download/v0.1.1/HELM_0.1.1_x64-setup.exe"
    }
  }
}
```

Because the endpoint uses `/releases/latest/download/latest.json`, whichever release is marked **latest**
is what every client updates to. Publishing the release is the whole deploy — clients pick it up on their
next launch.

> CI option: `tauri-apps/tauri-action` builds, signs (given the key as a secret), and generates
> `latest.json` automatically. Same key + pubkey; just move the two `TAURI_SIGNING_*` values into repo
> secrets.

## Code signing (separate from update signing)

The minisign key secures **updates**. It does **not** stop Windows SmartScreen showing "unknown
publisher" on first install. For that you need an OS **Authenticode** code-signing certificate
(configured under `bundle.windows.certificateThumbprint` / signing env). Optional, but recommended
before wide distribution.

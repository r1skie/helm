// Typed Control API client. In mock mode (default; NEXT_PUBLIC_HELM_MOCK !== '0') it serves canned
// data so the UI is previewable with no server. Point at a real control plane with
// NEXT_PUBLIC_HELM_MOCK=0 and NEXT_PUBLIC_HELM_API_URL=https://host:9200.
import { mock } from '@/shared/lib/mock';
import type {
  ActionItem, ActivateResponse, CashoutResponse, EnqueueImportResponse, Group,
  ImportsResponse, SettingsResponse, StatsResponse, StatusResponse, TenantPublic,
} from '@/shared/types/api';

const BASE = process.env.NEXT_PUBLIC_HELM_API_URL || 'http://127.0.0.1:9200';
const MOCK = process.env.NEXT_PUBLIC_HELM_MOCK !== '0';

let _token = '';
export function setAuthToken(token: string): void { _token = token; }
export function getAuthToken(): string { return _token; }

export class ApiError extends Error {
  status: number;
  errors?: string[];
  constructor(status: number, message: string, errors?: string[]) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  let resp: Response;
  try {
    resp = await fetch(BASE + path, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(_token ? { Authorization: `Bearer ${_token}` } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, 'Cannot reach the control plane. Is it running?');
  }
  let data: unknown = null;
  try { data = await resp.json(); } catch { /* empty body */ }
  if (!resp.ok) {
    const d = (data ?? {}) as { error?: string; errors?: string[] };
    throw new ApiError(resp.status, d.error || resp.statusText, d.errors);
  }
  return data as T;
}

export const api = {
  async activate(licenseKey: string, hwid: string, appVersion = '0.1.0'): Promise<ActivateResponse> {
    if (MOCK) return mock.activate(licenseKey);
    return request<ActivateResponse>('POST', '/api/activate',
      { license_key: licenseKey, hwid, app_version: appVersion });
  },
  async refresh(): Promise<ActivateResponse> {
    if (MOCK) { const m = await mock.me(); return { token: 'mock-token',
      expires_ts: Math.floor(Date.now() / 1000) + 86400, tenant: m.tenant }; }
    return request<ActivateResponse>('POST', '/api/refresh');
  },
  async me(): Promise<{ tenant: TenantPublic }> {
    if (MOCK) return mock.me();
    return request<{ tenant: TenantPublic }>('GET', '/api/me');
  },
  async status(): Promise<StatusResponse> {
    if (MOCK) return mock.status();
    return request<StatusResponse>('GET', '/api/status');
  },
  async stats(): Promise<StatsResponse> {
    if (MOCK) return mock.stats();
    return request<StatsResponse>('GET', '/api/stats');
  },
  async settings(): Promise<SettingsResponse> {
    if (MOCK) return mock.settings();
    return request<SettingsResponse>('GET', '/api/settings');
  },
  async putSettings(values: Record<string, string>, restart = true) {
    if (MOCK) return mock.putSettings(values);
    return request<{ ok: boolean; restarted: boolean; secrets_set: string[]; warning?: string }>(
      'PUT', '/api/settings', { values, restart });
  },
  async groups(): Promise<{ groups: Group[] }> {
    if (MOCK) return mock.groups();
    return request<{ groups: Group[] }>('GET', '/api/groups');
  },
  async imports(): Promise<ImportsResponse> {
    if (MOCK) return mock.imports();
    return request<ImportsResponse>('GET', '/api/imports');
  },
  async enqueueImport(kind: string, source: string, targetChatId: number): Promise<EnqueueImportResponse> {
    if (MOCK) return mock.enqueue(kind);
    return request<EnqueueImportResponse>('POST', '/api/imports',
      { kind, source, target_chat_id: targetChatId });
  },
  async actions(): Promise<{ actions: ActionItem[] }> {
    if (MOCK) return mock.actions();
    return request<{ actions: ActionItem[] }>('GET', '/api/actions');
  },
  async runAction(key: string): Promise<{ ok: boolean; action: string }> {
    if (MOCK) return mock.runAction(key);
    return request<{ ok: boolean; action: string }>('POST', `/api/actions/${key}`);
  },
  async cashout(): Promise<CashoutResponse> {
    if (MOCK) return mock.cashout();
    return request<CashoutResponse>('GET', '/api/cashout');
  },
  // POST /api/cashout is intentionally 501 for now (withdrawals are operator-processed) — this
  // resolves to the server's message via ApiError so the UI can surface it.
  async requestCashout(): Promise<{ ok: boolean }> {
    if (MOCK) throw new ApiError(501, 'self-serve withdrawal not yet available; contact the operator');
    return request<{ ok: boolean }>('POST', '/api/cashout');
  },
};

export const IS_MOCK = MOCK;

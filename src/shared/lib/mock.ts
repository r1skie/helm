// In-memory mock of the Control API so `pnpm dev` shows a fully populated UI with no server.
// Enabled unless NEXT_PUBLIC_HELM_MOCK === '0'. Mirrors controlplane/control_api.py shapes.
import type {
  ActivateResponse, BrokerStatus, CashoutResponse, EnqueueImportResponse, Group,
  ImportsResponse, SettingsField, SettingsResponse, StatsResponse, StatusResponse,
} from '@/shared/types/api';

const tenant = { id: 'demo-tenant', tier: 'pro', status: 'active' as const,
  active_until: Math.floor(Date.now() / 1000) + 26 * 86400 };

const broker: BrokerStatus = { running: 1, cap: 2, queued: 1,
  running_tenants: ['demo-tenant'], queued_tenants: ['other-tenant'] };

const _settingsValues: Record<string, string> = {
  BOT_TOKEN: '', ADMIN_IDS: '11111111', OWNER_ID: '11111111', BRAND_NAME: 'Acme',
  PAYMENT_PROVIDER: 'plisio', PLISIO_API_KEY: '', STARS_ENABLED: '1', STARS_PER_USD: '50',
  CONFIRMATION_MODE: 'poll', TRIAL_DAYS: '0', LINK_CONCURRENCY: '2',
};

const _mockSchema: SettingsField[] = [
  f('BOT_TOKEN', 'Bot token', 'Telegram', 'secret', { required: true, essential: true,
    setup_url: 'https://t.me/BotFather', placeholder: '123456:ABC-DEF…' }),
  f('ADMIN_IDS', 'Admin user IDs', 'Telegram', 'entry', { essential: true,
    hint: 'Your numeric Telegram ID — message @userinfobot.' }),
  f('BRAND_NAME', 'Brand name', 'Telegram', 'entry', { placeholder: 'Acme' }),
  f('PAYMENT_PROVIDER', 'Payment provider', 'Payments', 'combo',
    { default: 'nowpayments', choices: ['nowpayments', 'oxapay', 'plisio'] }),
  f('PLISIO_API_KEY', 'Plisio API key', 'Payments', 'secret',
    { depends_on: ['PAYMENT_PROVIDER', ['plisio']] }),
  f('STARS_ENABLED', 'Telegram Stars', 'Payments', 'switch', { default: '1' }),
  f('STARS_PER_USD', 'Stars per USD', 'Payments', 'int', { default: '50' }),
  f('CONFIRMATION_MODE', 'Confirmation mode', 'Webhook & Security', 'combo',
    { default: 'poll', choices: ['poll', 'webhook', 'both'] }),
  f('LINK_CONCURRENCY', 'Link import concurrency', 'Storage & Logging', 'int', { default: '2' }),
];

function f(key: string, label: string, section: string, widget: SettingsField['widget'],
  extra: Partial<SettingsField> = {}): SettingsField {
  return {
    key, label, section, widget, default: '', required: false, advanced: false, essential: false,
    tooltip: '', hint: '', setup_url: null, choices: null, depends_on: null, placeholder: '',
    secret: widget === 'secret', ...extra,
  };
}

const groups: Group[] = [
  { group_key: 'vip', name: 'VIP Channel', chat_id: -1001111111111, role: 'paid', active: 1,
    plans: [
      { plan_key: '30d', label: '30 days', price_usd: 15, days: 30, lifetime: 0 },
      { plan_key: 'life', label: 'Lifetime', price_usd: 60, days: 0, lifetime: 1 },
    ] },
  { group_key: 'community', name: 'Community', chat_id: -1002222222222, role: 'free', active: 1,
    plans: [] },
];

const delay = (ms = 240) => new Promise((r) => setTimeout(r, ms));

export const mock = {
  async activate(license: string): Promise<ActivateResponse> {
    await delay();
    if (!license) throw { status: 400, message: 'license_key and hwid are required' };
    return { token: 'mock-token', expires_ts: Math.floor(Date.now() / 1000) + 86400, tenant };
  },
  async me() { await delay(120); return { tenant }; },
  async status(): Promise<StatusResponse> {
    await delay();
    return { status: tenant.status, container: 'running', tier: tenant.tier,
      active_until: tenant.active_until };
  },
  async stats(): Promise<StatsResponse> {
    await delay();
    return {
      members: 1284, paid_users: 342, active_subscriptions: 357, revenue_usd: 5218.5,
      active_by_group: { vip: 355, community: 2 },
      revenue_by_group: { vip: 5218.5, community: 0 },
      jobs: { pending: 1, running: 1, done: 214, failed: 3 },
    };
  },
  async settings(): Promise<SettingsResponse> {
    await delay();
    return { schema: _mockSchema, sections: ['Telegram', 'Payments', 'Webhook & Security',
      'Userbot', 'Features', 'Revenue Recovery', 'Intervals', 'Storage & Logging'],
      values: { ..._settingsValues, BOT_TOKEN: '', PLISIO_API_KEY: '' },
      secrets_set: ['BOT_TOKEN', 'PLISIO_API_KEY'] };
  },
  async putSettings(values: Record<string, string>) {
    await delay(500);
    Object.assign(_settingsValues, values);
    return { ok: true, restarted: true, secrets_set: ['BOT_TOKEN', 'PLISIO_API_KEY'] };
  },
  async groups() { await delay(); return { groups }; },
  async imports(): Promise<ImportsResponse> {
    await delay();
    return {
      imports: {
        mega_import: { pending_or_running: true,
          last: { phase: 'running', posted: 128, total: 540 } },
        link_import: { pending_or_running: false,
          last: { phase: 'queued', queue_position: 2 } },
      },
      broker,
    };
  },
  async enqueue(kind: string): Promise<EnqueueImportResponse> {
    await delay(400);
    return { ok: true, job_id: Math.floor(Math.random() * 9000) + 1000, kind, broker };
  },
  async actions() { await delay(120); return { actions: [{ key: 'restart', label: 'Restart the tenant containers' }] }; },
  async runAction(key: string) { await delay(600); return { ok: true, action: key }; },
  async cashout(): Promise<CashoutResponse> {
    await delay();
    return { revenue_usd: 5218.5, methods: ['crypto', 'stars'],
      note: 'Withdrawals are operator-processed for now (see /withdraw, /starscashout).' };
  },
};

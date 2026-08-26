// Types mirroring controlplane/control_api.py — the single contract this client is built around.

export type TenantStatus = 'provisioning' | 'active' | 'suspended' | 'destroyed';

export interface TenantPublic {
  id: string;
  tier: string;
  status: TenantStatus;
  active_until: number; // unix seconds; 0 = none
}

export interface ActivateResponse {
  token: string;
  expires_ts: number;
  tenant: TenantPublic;
}

export interface StatsResponse {
  members: number;
  paid_users: number;
  active_subscriptions: number;
  revenue_usd: number;
  active_by_group: Record<string, number>;
  revenue_by_group: Record<string, number>;
  jobs: Record<string, number>;
}

export interface StatusResponse {
  status: TenantStatus;
  container: string;
  tier: string;
  active_until: number;
}

export type WidgetKind = 'entry' | 'secret' | 'combo' | 'switch' | 'int';

export interface SettingsField {
  key: string;
  label: string;
  section: string;
  widget: WidgetKind;
  default: string;
  required: boolean;
  advanced: boolean;
  essential: boolean;
  tooltip: string;
  hint: string;
  setup_url: string | null;
  choices: string[] | null;
  depends_on: [string, string[]] | null;
  placeholder: string;
  secret: boolean;
}

export interface SettingsResponse {
  schema: SettingsField[];
  sections: string[];
  values: Record<string, string>;
  secrets_set: string[];
}

export interface Plan {
  plan_key?: string;
  label?: string;
  price_usd?: number;
  days?: number;
  lifetime?: number;
  [k: string]: unknown;
}

export interface Group {
  group_key?: string;
  key?: string;
  name?: string;
  chat_id?: number;
  role?: string;
  active?: number;
  plans: Plan[];
  [k: string]: unknown;
}

export interface ImportLast {
  phase?: string;
  queue_position?: number;
  posted?: number;
  total?: number;
  [k: string]: unknown;
}

export interface ImportKindState {
  pending_or_running: boolean;
  last: ImportLast | null;
}

export interface BrokerStatus {
  running: number;
  cap: number;
  queued: number;
  running_tenants: string[];
  queued_tenants: string[];
}

export interface ImportsResponse {
  imports: Record<string, ImportKindState>;
  broker: BrokerStatus;
}

export interface EnqueueImportResponse {
  ok: boolean;
  job_id: number;
  kind: string;
  broker: BrokerStatus;
}

export interface ActionItem {
  key: string;
  label: string;
}

export interface CashoutResponse {
  revenue_usd: number;
  methods: string[];
  note: string;
}

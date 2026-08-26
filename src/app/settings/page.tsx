'use client';
import { useEffect, useMemo, useState } from 'react';
import { TbDeviceFloppy, TbExternalLink } from 'react-icons/tb';

import { Button } from '@/shared/components/ui/Button';
import { PageHeader } from '@/shared/components/ui/SectionHeader';
import { api, ApiError } from '@/shared/lib/api';
import { toast } from '@/shared/stores/toastStore';
import type { SettingsField, SettingsResponse } from '@/shared/types/api';

export default function SettingsPage() {
  const [resp, setResp] = useState<SettingsResponse | null>(null);
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [section, setSection] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => {
    void api.settings().then((r) => {
      setResp(r);
      setSection((s) => s || r.sections[0]);
    }).catch(() => toast.error('Failed to load settings'));
  };
  useEffect(load, []);

  const val = (key: string): string =>
    edits[key] ?? resp?.values[key] ?? '';

  const visible = (f: SettingsField): boolean => {
    if (!f.depends_on) return true;
    const [depKey, allowed] = f.depends_on;
    return allowed.includes(val(depKey));
  };

  const fields = useMemo(
    () => (resp?.schema ?? []).filter((f) => f.section === section && visible(f)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [resp, section, edits],
  );

  const save = async () => {
    if (Object.keys(edits).length === 0) { toast.info('No changes'); return; }
    setSaving(true);
    try {
      const r = await api.putSettings(edits);
      toast.success('Saved', r.restarted ? 'Bot restarted with new settings.' : 'Settings written.');
      setEdits({});
      load();
    } catch (e) {
      const msg = e instanceof ApiError && e.errors?.length ? e.errors.join('; ')
        : e instanceof ApiError ? e.message : 'Save failed';
      toast.error('Validation failed', msg);
    } finally {
      setSaving(false);
    }
  };

  const dirty = Object.keys(edits).length;

  return (
    <div>
      <PageHeader title="Settings" subtitle="Configure your bot — changes restart it automatically"
        actions={<Button onClick={() => void save()} loading={saving} disabled={dirty === 0}>
          <TbDeviceFloppy /> Save{dirty ? ` (${dirty})` : ''}
        </Button>} />

      <div className="grid grid-cols-[12rem_1fr] gap-6">
        <nav className="flex flex-col gap-1">
          {resp?.sections.map((s) => (
            <button key={s} onClick={() => setSection(s)}
              className={`text-left px-3 h-9 rounded-lg text-sm transition-colors ${section === s
                ? 'bg-item text-content font-medium'
                : 'text-altwhite/70 hover:bg-item/60 hover:text-content'}`}>
              {s}
            </button>
          ))}
        </nav>

        <div className="surface-elev p-5 flex flex-col gap-5">
          {fields.length === 0 && <span className="text-sm text-altwhite/50">No settings here.</span>}
          {fields.map((f) => (
            <FieldRow key={f.key} field={f} value={val(f.key)}
              secretSet={resp?.secrets_set.includes(f.key) ?? false}
              edited={edits[f.key] !== undefined}
              onChange={(v) => setEdits((e) => ({ ...e, [f.key]: v }))} />
          ))}
        </div>
      </div>
    </div>
  );
}

function FieldRow({ field, value, secretSet, edited, onChange }:
{ field: SettingsField; value: string; secretSet: boolean; edited: boolean;
  onChange: (v: string) => void }) {
  const inputCls = 'surface-soft px-3 h-10 rounded-lg bg-transparent outline-none text-sm '
    + 'text-content placeholder:text-altwhite/40 focus:ring-2 focus:ring-content/30 w-full';

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-content">{field.label}</label>
        {field.required && <span className="text-[10px] text-danger/80">required</span>}
        {field.setup_url && (
          <a href={field.setup_url} target="_blank" rel="noreferrer"
            className="text-altwhite/40 hover:text-content transition-colors"><TbExternalLink /></a>
        )}
      </div>
      {field.hint && <p className="text-[11px] text-altwhite/50">{field.hint}</p>}

      {field.widget === 'combo' ? (
        <select value={value} onChange={(e) => onChange(e.target.value)}
          className={inputCls}>
          {field.choices?.map((c) => <option key={c} value={c} className="bg-sidebar">{c}</option>)}
        </select>
      ) : field.widget === 'switch' ? (
        <button onClick={() => onChange(value === '1' ? '0' : '1')}
          className={`h-6 w-11 rounded-full transition-colors relative ${value === '1'
            ? 'bg-content' : 'bg-item ring-1 ring-border'}`}>
          <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-base transition-all
            ${value === '1' ? 'left-[1.375rem]' : 'left-0.5'}`} />
        </button>
      ) : (
        <input
          type={field.secret ? 'password' : 'text'}
          inputMode={field.widget === 'int' ? 'numeric' : undefined}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.secret && secretSet && !edited ? '•••••••• stored' : field.placeholder}
          className={inputCls} />
      )}
    </div>
  );
}

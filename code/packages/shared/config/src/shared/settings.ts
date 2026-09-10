/**
 * Worker-read operational settings: version-controlled defaults + per-key bounds.
 * The `def` values are the source of truth and the disclosed baseline; the D1
 * `site_settings` table holds only operator overrides, clamped to [min,max] here.
 * Imported by the `cron` (defaults + fallback) and the `api` (validation + effective
 * values). React-free — safe in a bare Worker.
 */
export const SETTINGS = {
  "retention.audit_days": { def: 90, min: 30, max: 3650, unit: "days" },
  "retention.consent_days": { def: 1095, min: 1095, max: 3650, unit: "days" },
  "retention.erasure_request_days": {
    def: 1095,
    min: 1095,
    max: 3650,
    unit: "days",
  },
  "retention.data_request_days": { def: 365, min: 30, max: 3650, unit: "days" },
  "retention.csp_days": { def: 30, min: 7, max: 365, unit: "days" },
  "ops.sla_warning_days": { def: 7, min: 1, max: 30, unit: "days" },
  "ttl.export_download_hours": { def: 1, min: 1, max: 24, unit: "hours" },
  "ttl.erasure_confirm_hours": { def: 24, min: 1, max: 168, unit: "hours" },
} as const satisfies Record<
  string,
  { def: number; min: number; max: number; unit: "days" | "hours" }
>;

export type SettingKey = keyof typeof SETTINGS;

export const SETTING_DEFAULTS = Object.fromEntries(
  Object.entries(SETTINGS).map(([k, r]) => [k, r.def]),
) as Record<SettingKey, number>;

/** Parse + clamp an override string to its key's [min,max]; null if unknown/non-integer. */
export function coerceSetting(key: string, raw: string): number | null {
  const rule = (SETTINGS as Record<string, { min: number; max: number }>)[key];
  if (!rule) return null;
  const n = Number(raw);
  if (!Number.isInteger(n)) return null;
  return Math.min(rule.max, Math.max(rule.min, n));
}

/** Merge DB override rows over the defaults; unknown/invalid rows ignored. */
export function effectiveSettings(
  rows: { key: string; value: string }[],
): Record<SettingKey, number> {
  const out = { ...SETTING_DEFAULTS };
  for (const { key, value } of rows) {
    const v = coerceSetting(key, value);
    if (v !== null) out[key as SettingKey] = v;
  }
  return out;
}

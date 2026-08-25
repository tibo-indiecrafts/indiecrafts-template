import { effectiveSettings, type SettingKey } from "@indiecrafts/packages-shared-config";

type CacheRef = { value: null | { at: number; data: Record<SettingKey, number> } };

/** Per-isolate cached effective settings (default ~30s). Fail-open to defaults. */
export async function readSettings(
  db: D1Database | undefined,
  ref: CacheRef,
  ttlMs = 30_000,
  now = Date.now(),
): Promise<Record<SettingKey, number>> {
  if (ref.value && now - ref.value.at < ttlMs) return ref.value.data;
  let data: Record<SettingKey, number>;
  try {
    const { results } = db
      ? await db.prepare("SELECT key, value FROM site_settings").all<{ key: string; value: string }>()
      : { results: [] as { key: string; value: string }[] };
    data = effectiveSettings(results);
  } catch {
    data = effectiveSettings([]);
  }
  ref.value = { at: now, data };
  return data;
}

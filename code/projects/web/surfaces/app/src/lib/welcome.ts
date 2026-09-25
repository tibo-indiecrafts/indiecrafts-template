/**
 * Read the editor-owned home welcome message from Sanity.
 *
 * @see docs/reference/projects/web/app/src/lib/welcome.md
 */
import { logger } from "@indiecrafts/packages-shared-logger";

/**
 * The editor-owned home welcome message (`appContent` singleton), read LIVE from
 * Sanity's CDN with a short per-isolate cache — an editor's change appears within
 * the TTL, no redeploy. **Fail-open**: unset project id or any error → no welcome
 * (the home falls back to its own message-file subtitle), never a broken page.
 * Mirrors `website/src/lib/maintenance.ts`. Reads the PUBLIC project id + dataset
 * straight from env (not `@indiecrafts/packages-web-sanity/env`, which asserts).
 */
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-01-01";

type LocaleText = Record<string, string> | null | undefined;
export type WelcomeData = { web?: LocaleText; shared?: LocaleText } | null;

const TTL_MS = 60_000;
const FAIL_TTL_MS = 5_000;
const QUERY =
  '*[_id == "appContent"][0]{ "web": web.welcome, "shared": shared.welcome }';

let cache: { value: WelcomeData; expires: number } | null = null;

/** Resolve the welcome for a locale: the `web` section wins over `shared`; `null`
 *  when neither has a line for that locale. Pure — the unit-tested seam. */
export function pickWelcome(data: WelcomeData, locale: string): string | null {
  return data?.web?.[locale] ?? data?.shared?.[locale] ?? null;
}

export async function getAppWelcome(locale: string): Promise<string | null> {
  const now = Date.now();
  if (cache && cache.expires > now) return pickWelcome(cache.value, locale);
  if (!projectId || !dataset) return null;
  try {
    const url = `https://${projectId}.apicdn.sanity.io/v${apiVersion}/data/query/${dataset}?query=${encodeURIComponent(QUERY)}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(2000) });
    if (!res.ok) return failOpen(now);
    const json = (await res.json()) as { result?: WelcomeData };
    const value = json.result ?? null;
    cache = { value, expires: now + TTL_MS };
    return pickWelcome(value, locale);
  } catch (error) {
    logger.error("app welcome read failed", { error });
    return failOpen(now);
  }
}

/** Cache a short "no welcome" so a transient Sanity error retries soon. */
function failOpen(now: number): null {
  cache = { value: null, expires: now + FAIL_TTL_MS };
  return null;
}

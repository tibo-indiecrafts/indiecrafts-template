/**
 * Read the live maintenance-mode flag from Sanity, cached per isolate and fail-open.
 *
 * @see docs/reference/projects/web/website/src/lib/maintenance.md
 */
import { apiVersion, dataset, projectId } from "@indiecrafts/packages-web-sanity/env";
import { logger } from "@indiecrafts/packages-shared-logger";

/**
 * The live, no-deploy maintenance switch — the editor flips
 * `siteSettings.maintenanceMode` in Studio and `proxy.ts` trips on it. Read at the
 * edge, so it uses a plain `fetch` to Sanity's **CDN** query endpoint (public
 * field, no token) with an in-memory per-isolate cache (~30s) — one read per TTL
 * window, not per request, so a toggle takes effect within a minute without
 * hammering Sanity. **Fail-open**: any error → not in maintenance (never 503 the
 * whole site because a fetch hiccuped). The build-time `features.maintenance` flag
 * is the hard override that skips this read entirely.
 */
const TTL_MS = 30_000;
const FAIL_TTL_MS = 5_000;
const QUERY = '*[_id == "siteSettings"][0].maintenanceMode';

let cache: { value: boolean; expires: number } | null = null;

export async function getMaintenanceMode(): Promise<boolean> {
  const now = Date.now();
  if (cache && cache.expires > now) return cache.value;
  try {
    const url = `https://${projectId}.apicdn.sanity.io/v${apiVersion}/data/query/${dataset}?query=${encodeURIComponent(QUERY)}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(2000) });
    if (!res.ok) return failOpen(now);
    const json = (await res.json()) as { result?: boolean | null };
    const value = json.result === true;
    cache = { value, expires: now + TTL_MS };
    return value;
  } catch (error) {
    logger.error("maintenance-mode read failed", { error });
    return failOpen(now);
  }
}

/** Cache a short "not in maintenance" so a transient Sanity error retries soon. */
function failOpen(now: number): boolean {
  cache = { value: false, expires: now + FAIL_TTL_MS };
  return false;
}

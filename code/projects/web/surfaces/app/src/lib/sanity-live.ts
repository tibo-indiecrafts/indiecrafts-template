/**
 * Read editor-owned Sanity content live, with a short per-isolate cache.
 *
 * @see docs/reference/projects/web/app/src/lib/sanity-live.md
 */
import { logger } from "@indiecrafts/packages-shared-logger";

/**
 * A GROQ query read LIVE from Sanity's CDN with a short per-isolate cache — an editor's
 * change appears within the TTL, no redeploy. **Fail-open**: unset project id or any
 * error → `null` (the caller falls back), never a broken page; a failure is cached
 * briefly so a transient Sanity error retries soon. Reads the PUBLIC project id + dataset
 * straight from env (not `@indiecrafts/packages-web-sanity/env`, which asserts).
 */
export function liveQuery<T>(
  query: string,
  label: string,
): () => Promise<T | null> {
  const TTL_MS = 60_000;
  const FAIL_TTL_MS = 5_000;
  let cache: { value: T | null; expires: number } | null = null;

  return async () => {
    const now = Date.now();
    if (cache && cache.expires > now) return cache.value;
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
    const apiVersion =
      process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-01-01";
    if (!projectId || !dataset) return null;
    try {
      const url = `https://${projectId}.apicdn.sanity.io/v${apiVersion}/data/query/${dataset}?query=${encodeURIComponent(query)}`;
      const res = await fetch(url, { signal: AbortSignal.timeout(2000) });
      if (!res.ok) {
        cache = { value: null, expires: now + FAIL_TTL_MS };
        return null;
      }
      const value = ((await res.json()) as { result?: T }).result ?? null;
      cache = { value, expires: now + TTL_MS };
      return value;
    } catch (error) {
      logger.error(`${label} read failed`, { error });
      cache = { value: null, expires: now + FAIL_TTL_MS };
      return null;
    }
  };
}

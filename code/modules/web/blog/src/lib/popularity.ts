/**
 * Read and record post views — the popularity signal behind the Trending block.
 *
 * @see docs/reference/modules/web/blog/src/lib/popularity.md
 */
import "server-only";
import type { Locale } from "@indiecrafts/packages-shared-config";
import { apiFetch } from "@indiecrafts/packages-shared-utils/api-fetch";
import { logger } from "@indiecrafts/packages-shared-logger";

/** The Trending window: views from the last N days count. */
const TRENDING_DAYS = 30;

/** The api origin + server token, or null when the api isn't wired (local, no env). */
function api(): { url: string; token: string } | null {
  const url = process.env.API_URL;
  const token = process.env.APP_API_TOKEN;
  return url && token ? { url, token } : null;
}

/**
 * The most-viewed posts of the last 30 days in `locale`, most viewed first — read from the
 * shared api's anonymous per-post counter (`GET /v1/views/top`, EU D1). Not cached: Next's
 * time-based revalidation needs an OpenNext queue the website doesn't run, and the api is
 * one fast Worker hop. On any failure (or no api) it returns `[]` and the Trending block
 * falls back to the latest posts — the front page never waits on, or breaks with, the counter.
 */
export async function getPopularPostIds(
  locale: Locale,
  count: number,
): Promise<string[]> {
  const target = api();
  if (!target) return [];
  try {
    const query = new URLSearchParams({
      locale,
      limit: String(count),
      days: String(TRENDING_DAYS),
    });
    const res = await apiFetch(`${target.url}/v1/views/top?${query}`, {
      headers: { authorization: `Bearer ${target.token}` },
      cache: "no-store",
      timeoutMs: 1500,
    });
    if (!res.ok) throw new Error(`views/top ${res.status}`);
    const { ids } = (await res.json()) as { ids?: unknown };
    return Array.isArray(ids)
      ? ids.filter((id): id is string => typeof id === "string")
      : [];
  } catch (error) {
    logger.error("getPopularPostIds failed", { locale, error });
    return [];
  }
}

/**
 * Count one view of `postId` (`POST /v1/views`). The website's `/api/views` route calls it
 * on the visitor's behalf; `clientIp` lets the api rate-limit per visitor. Best-effort: a
 * lost view only makes the count slightly low, so a failure is logged, never thrown.
 */
export async function recordPostView(input: {
  postId: string;
  locale: string;
  clientIp?: string;
}): Promise<void> {
  const target = api();
  if (!target) return;
  try {
    const res = await apiFetch(`${target.url}/v1/views`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${target.token}`,
        "content-type": "application/json",
        ...(input.clientIp ? { "x-client-ip": input.clientIp } : {}),
      },
      body: JSON.stringify({ postId: input.postId, locale: input.locale }),
      timeoutMs: 3000,
    });
    if (!res.ok && res.status !== 429) throw new Error(`views ${res.status}`);
  } catch (error) {
    logger.error("recordPostView failed", { postId: input.postId, error });
  }
}

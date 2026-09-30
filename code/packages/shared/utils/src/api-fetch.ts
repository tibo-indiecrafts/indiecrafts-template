/**
 * fetch for calls into the api: a timeout, and one safe retry (backoff + jitter).
 *
 * @see docs/reference/packages/shared/utils/src/api-fetch.md
 */
// The api brief's contract, caller side: a timeout on every call, and a retry only on a
// network error, a timeout, a 5xx or a 429 — never on another 4xx. A POST is retried only
// when the caller marks it `idempotent` (the api honours Idempotency-Key on /v1/events and
// /v1/export); the key is generated once and kept across the retry. Any other POST (cron run,
// erasure retry) could act twice, so it gets the timeout but no retry.
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const retryable = (status: number) => status >= 500 || status === 429;
const jitter = () => 300 + Math.random() * 500;

export type ApiFetchInit = RequestInit & {
  /** Abort after this many ms (default 10 s — longer than the api's own 5 s outbound calls). */
  timeoutMs?: number;
  /** Safe to repeat: sends an Idempotency-Key and allows one retry of a non-GET. */
  idempotent?: boolean;
};

export async function apiFetch(
  url: string,
  { timeoutMs = 10_000, idempotent = false, ...init }: ApiFetchInit = {},
): Promise<Response> {
  const method = (init.method ?? "GET").toUpperCase();
  const safe = method === "GET" || method === "HEAD";
  const headers = new Headers(init.headers);
  // POST only: PUT/DELETE are idempotent by definition (the api ignores the key there).
  if (method === "POST" && idempotent && !headers.has("idempotency-key"))
    headers.set("idempotency-key", crypto.randomUUID());
  const canRetry = safe || idempotent;
  const plain: Record<string, string> = {};
  headers.forEach((value, key) => {
    plain[key] = value;
  });
  const attempt = () =>
    fetch(url, {
      ...init,
      // A plain object (lower-case keys), as callers and their tests pass headers.
      headers: plain,
      signal: AbortSignal.timeout(timeoutMs),
    });

  try {
    const res = await attempt();
    if (!canRetry || !retryable(res.status)) return res;
    const after = Number(res.headers.get("retry-after"));
    await sleep(after > 0 && after <= 5 ? after * 1000 : jitter());
  } catch (error) {
    if (!canRetry) throw error;
    await sleep(jitter());
  }
  return attempt();
}

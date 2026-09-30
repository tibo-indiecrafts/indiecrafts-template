/**
 * Rate-limit a key with a best-effort fixed window over Workers KV.
 *
 * @see docs/reference/packages/shared/security/src/rate-limit.md
 */
import "server-only";

/**
 * Best-effort **fixed-window** limiter backed by Workers KV (binding
 * `RATE_LIMIT_KV`). **No-ops (allows)** when the binding isn't bound — the
 * Cloudflare **WAF rate-limit rule** on `/api/*` is the PRIMARY limiter (see
 * `code/docs/projects/web/website/setup/deployment.md` + `code/docs/infra/cloudflare-iac.md`);
 * this is the portable in-app
 * fallback that also works in local `wrangler`/dev when a KV namespace is wired.
 *
 * The window resets `windowSec` after the first hit; a KV read/write error never
 * blocks a real request (fail-open — availability over strictness for a fallback).
 */
export async function rateLimit(
  key: string,
  limit: number,
  windowSec: number,
): Promise<{ ok: boolean; remaining: number }> {
  const kv = await getKV();
  if (!kv) return { ok: true, remaining: limit };
  const k = `rl:${key}`;
  const now = Date.now();
  let rec: { c: number; r: number } | null = null;
  try {
    const raw = await kv.get(k);
    rec = raw ? (JSON.parse(raw) as { c: number; r: number }) : null;
  } catch {
    rec = null;
  }
  if (!rec || now > rec.r) rec = { c: 0, r: now + windowSec * 1000 };
  rec.c += 1;
  try {
    await kv.put(k, JSON.stringify(rec), { expirationTtl: windowSec + 5 });
  } catch {
    return { ok: true, remaining: limit }; // write failed → don't block
  }
  return { ok: rec.c <= limit, remaining: Math.max(0, limit - rec.c) };
}

type KVLike = {
  get(k: string): Promise<string | null>;
  put(k: string, v: string, o?: { expirationTtl?: number }): Promise<void>;
};

/**
 * Resolve the `RATE_LIMIT_KV` binding via the OpenNext Cloudflare context; `null`
 * off-CF. The specifier is a variable so this stays a runtime-only dynamic import
 * — the brick doesn't take a hard `@opennextjs/cloudflare` dependency (the app
 * provides it; off-CF the import just fails and we no-op).
 */
async function getKV(): Promise<KVLike | null> {
  try {
    const spec = "@opennextjs/cloudflare";
    const mod = (await import(spec).catch(() => null)) as {
      getCloudflareContext?: () => { env?: Record<string, unknown> };
    } | null;
    const kv = mod?.getCloudflareContext?.().env?.RATE_LIMIT_KV;
    return (kv as KVLike | undefined) ?? null;
  } catch {
    return null;
  }
}

import "server-only";
import { sanitizeIpAddress } from "./ip";
import { isSameSiteRequest } from "./origin";
import { verifyTurnstile } from "./turnstile";
import { rateLimit } from "./rate-limit";

/**
 * Request-boundary hardening for public POST route handlers — the abuse layer on
 * top of each engine's own validation/honeypot/whitelisting. `withGuard` wraps a
 * handler and, before it runs, enforces:
 *
 *   - **origin** — reject cross-site POSTs (`Sec-Fetch-Site`, or `Origin` vs `Host`);
 *     non-browser callers (no `Origin`) pass — there's no CSRF vector for them.
 *   - **body cap** — `Content-Length` (and the actual text) ≤ `bodyMax` → `413`.
 *   - **rate limit** — optional fixed window per client-IP + path → `429`
 *     (no-ops unless `RATE_LIMIT_KV` is bound; the CF WAF rule is primary).
 *   - **Turnstile** — optional; verifies `cf-turnstile-response` from the body
 *     (no-ops until `TURNSTILE_SECRET` is set) → `403`.
 *
 * It parses the JSON body ONCE and hands it to the handler (no double parse).
 * Fail-closed on origin; every block is a terse 4xx.
 */
export type GuardOptions = {
  /** Reject cross-site POSTs. `true` = same-origin/site only; `string[]` = extra allowed origins; `false` = off. Default `true`. */
  origin?: boolean | string[];
  /** Max request body bytes. Default `16000`. */
  bodyMax?: number;
  /** Fixed-window limit per client-IP + path. Omit to skip (or rely on the CF WAF rule). */
  rateLimit?: { limit: number; windowSec: number };
  /** Verify a Cloudflare Turnstile token (body field `cf-turnstile-response`). No-ops until configured. */
  turnstile?: boolean;
};

// Prefer Cloudflare's trusted `cf-connecting-ip`, then the first `x-forwarded-for`
// hop — both are validated, so a spoofed/garbage header can't poison the rate-limit key.
// Exported so a route that can't adopt `withGuard` (e.g. a cross-site form POST) can
// still key `rateLimit` off the same trusted IP derivation.
export const clientIp = (req: Request): string =>
  sanitizeIpAddress(req.headers.get("cf-connecting-ip")) ??
  sanitizeIpAddress(
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
  ) ??
  "unknown";

const json = (body: unknown, status: number): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });

export function withGuard(
  handler: (req: Request, body: unknown) => Promise<Response> | Response,
  opts: GuardOptions = {},
): (req: Request) => Promise<Response> {
  const {
    origin = true,
    bodyMax = 16_000,
    rateLimit: rl,
    turnstile: needTurnstile,
  } = opts;
  return async (req: Request): Promise<Response> => {
    if (!isSameSiteRequest(req, origin))
      return json({ error: "forbidden" }, 403);

    if (Number(req.headers.get("content-length") ?? 0) > bodyMax)
      return json({ error: "too_large" }, 413);

    const ip = clientIp(req); // computed once — reused for rate-limit + turnstile

    if (rl) {
      const { ok } = await rateLimit(
        `${ip}:${new URL(req.url).pathname}`,
        rl.limit,
        rl.windowSec,
      );
      if (!ok) return json({ error: "rate_limited" }, 429);
    }

    let body: unknown;
    try {
      const text = await req.text();
      // Cap by BYTE length (not UTF-16 units) when Content-Length lies/absent.
      if (new TextEncoder().encode(text).length > bodyMax)
        return json({ error: "too_large" }, 413);
      body = text ? JSON.parse(text) : {};
    } catch {
      return json({ error: "invalid" }, 400);
    }

    if (needTurnstile) {
      const token = (body as Record<string, unknown> | null)?.[
        "cf-turnstile-response"
      ];
      if (!(await verifyTurnstile(typeof token === "string" ? token : "", ip)))
        return json({ error: "challenge" }, 403);
    }

    return handler(req, body);
  };
}

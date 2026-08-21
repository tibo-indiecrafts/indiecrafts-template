import { addTransport, logger } from "@indiecrafts/packages-shared-logger";
import { cloudflareTransport } from "@indiecrafts/packages-shared-logger/cloudflare";
import { getCurrentEnvironment } from "@indiecrafts/packages-shared-config";
import { runAgent, SPECS } from "@indiecrafts/packages-shared-agent";

// Production console is silent (no request-log noise); forward error/fatal to Workers
// Logs anyway. Non-prod skips it — its console already shows errors.
if (getCurrentEnvironment() === "production") addTransport(cloudflareTransport());

/**
 * Agent worker — the ONE dedicated bare Cloudflare Worker hosting the AI agent for EVERY
 * surface (web · mobile · hybrid). It consolidates the two former entry points (the
 * website's Next `/api/agent` route + the `api` worker's `/v1/agent`). The agent CORE is
 * the `@indiecrafts/packages-shared-agent` brick; this is its deploy shell + request guard.
 *
 * `withGuard` and the security brick's `verifyTurnstile` both `import "server-only"`, which
 * breaks the bare-Worker esbuild build — so this worker INLINES its guard, dual-mode on the
 * `Origin` header:
 *   • Browser (allowlisted `Origin`) → Turnstile token (in the body) + CORS + rate-limit.
 *   • Native   (no `Origin`)         → bearer `APP_API_TOKEN` + rate-limit.
 * `ANTHROPIC_API_KEY` stays server-only — this Worker is its single home. Human-in-the-loop:
 * the result is a draft to review, not an action.
 */
export interface Env {
  /** `wrangler secret put ANTHROPIC_API_KEY` — the server-only Claude key. */
  ANTHROPIC_API_KEY?: string;
  /** `wrangler secret put APP_API_TOKEN` — the native bearer gate. */
  APP_API_TOKEN?: string;
  /** `wrangler secret put TURNSTILE_SECRET` — the browser bot gate (opt-in: unset → passes). */
  TURNSTILE_SECRET?: string;
  /** Comma-separated browser origins allowed to call (the deployed site); localhost dev is built in. */
  WEB_ORIGIN?: string;
  /** Cloudflare native rate-limit binding (`[[unsafe.bindings]]` in wrangler.toml). */
  AGENT_RATELIMIT?: { limit: (o: { key: string }) => Promise<{ success: boolean }> };
}

const BODY_MAX = 4000;

/** The browser origins allowed the agent (Turnstile-gated): dev servers + `WEB_ORIGIN`. */
function allowedOrigins(env: Env): Set<string> {
  const set = new Set(["http://localhost:3000", "http://localhost:5173"]);
  for (const o of (env.WEB_ORIGIN ?? "").split(",")) if (o.trim()) set.add(o.trim());
  return set;
}

function corsHeaders(
  origin: string | null,
  allowed: Set<string>,
): Record<string, string> {
  if (origin && allowed.has(origin))
    return {
      "access-control-allow-origin": origin,
      "access-control-allow-headers": "authorization, content-type",
      "access-control-allow-methods": "POST, OPTIONS",
    };
  return {};
}

/** Constant-time compare — no early return, so timing doesn't leak the mismatch. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

const clientIp = (req: Request): string =>
  req.headers.get("cf-connecting-ip") ?? "unknown";

function json(body: unknown, status: number, cors: Record<string, string>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...cors },
  });
}

/**
 * Verify a Cloudflare Turnstile token — inlined (the security brick's verifier is
 * `server-only`, which breaks the esbuild build, and reads `process.env`, not the Worker
 * `env`). Opt-in: an unset secret PASSES (the per-engine honeypot stays the defence); a set
 * secret fails **closed** on a verify error.
 */
async function verifyTurnstile(
  token: string,
  secret: string | undefined,
  ip: string,
): Promise<boolean> {
  if (!secret) return true;
  if (!token) return false;
  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ secret, response: token, remoteip: ip }),
      },
    );
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false; // verify unreachable while Turnstile IS configured → fail closed
  }
}

export default {
  async fetch(
    request: Request,
    env: Env,
    _ctx: ExecutionContext,
  ): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/health") return Response.json({ ok: true });

    const origin = request.headers.get("origin");
    const allowed = allowedOrigins(env);
    const cors = corsHeaders(origin, allowed);

    // ── AI agent — POST /v1/agent/:name (shared core; a draft for HUMAN REVIEW) ──
    const match = url.pathname.match(/^\/v1\/agent\/([a-z0-9-]+)$/);
    if (match) {
      if (request.method === "OPTIONS")
        return new Response(null, { status: 204, headers: cors });
      if (request.method !== "POST")
        return json({ error: "method_not_allowed" }, 405, cors);

      // Body cap + parse FIRST — both the agent input AND the Turnstile token live here.
      if (Number(request.headers.get("content-length") ?? 0) > BODY_MAX)
        return json({ error: "too_large" }, 413, cors);
      let body: {
        context?: unknown;
        locale?: unknown;
        "cf-turnstile-response"?: unknown;
      };
      try {
        const text = await request.text();
        if (new TextEncoder().encode(text).length > BODY_MAX)
          return json({ error: "too_large" }, 413, cors);
        body = text ? (JSON.parse(text) as typeof body) : {};
      } catch {
        return json({ error: "invalid" }, 400, cors);
      }

      // Dual-mode auth on `Origin`. Browser → Turnstile; native (no Origin) → bearer.
      if (origin) {
        if (!allowed.has(origin)) return json({ error: "forbidden" }, 403, cors);
        const token =
          typeof body["cf-turnstile-response"] === "string"
            ? body["cf-turnstile-response"]
            : "";
        if (!(await verifyTurnstile(token, env.TURNSTILE_SECRET, clientIp(request))))
          return json({ error: "unauthorized" }, 401, cors);
      } else {
        const bearer = (request.headers.get("authorization") ?? "").replace(
          /^Bearer\s+/i,
          "",
        );
        if (!env.APP_API_TOKEN || !bearer || !safeEqual(bearer, env.APP_API_TOKEN))
          return json({ error: "unauthorized" }, 401, cors);
      }

      // Rate limit (both paths; Cloudflare native binding; no-op if unbound).
      if (env.AGENT_RATELIMIT) {
        const { success } = await env.AGENT_RATELIMIT.limit({ key: clientIp(request) });
        if (!success) return json({ error: "rate_limited" }, 429, cors);
      }

      const spec = SPECS[match[1]];
      if (!spec) return json({ error: "not_found" }, 404, cors);
      if (!env.ANTHROPIC_API_KEY) return json({ error: "unavailable" }, 503, cors);

      const context = typeof body.context === "string" ? body.context : "";
      const locale = typeof body.locale === "string" ? body.locale : undefined;
      const result = await runAgent(spec, { context, locale }, env.ANTHROPIC_API_KEY);
      if (!result.ok) return json({ error: "server" }, 502, cors);
      return json({ data: result.data }, 200, cors);
    }

    logger.info("agent request", { method: request.method, pathname: url.pathname });
    return new Response("Not found", { status: 404 });
  },
} satisfies ExportedHandler<Env>;

import { addTransport, logger } from "@indiecrafts/packages-shared-logger";
import { cloudflareTransport } from "@indiecrafts/packages-shared-logger/cloudflare";
import {
  getCurrentEnvironment,
  defaultLocale,
  type Locale,
} from "@indiecrafts/packages-shared-config";
import {
  hashIpAddress,
  fingerprintEmail,
} from "@indiecrafts/packages-shared-security/crypto";
import {
  classifyFailedLogins,
  FAILED_LOGIN,
  bumpCounter,
} from "@indiecrafts/packages-shared-security-events";
import { resolveRegulation } from "@indiecrafts/packages-shared-compliance/shared";
import {
  SURFACES,
  resolveBanner,
  resolveToast,
  bannerQuery,
  toastQuery,
  type Surface,
  type RawBanner,
  type RawToast,
} from "@indiecrafts/packages-shared-announcement";

// Production console is silent (no request-log noise); this forwards error/fatal to
// Workers Logs anyway. Non-prod skips it — its console already shows errors.
if (getCurrentEnvironment() === "production")
  addTransport(cloudflareTransport());

/**
 * HTTP API worker — a **bare** Cloudflare Worker (no Next/OpenNext). The deploy
 * shell for the non-web clients (mobile, hybrid). Serves `POST /v1/events` (the audit +
 * session-event sink → the EU D1). The AI agent moved to its own `shared/agent` Worker.
 * Real logic lives in bricks imported `workspace:*`. Run `pnpm cf-typegen` after editing
 * bindings in wrangler.toml.
 *
 * `withGuard` (@indiecrafts/packages-shared-security) is Next-only (`server-only`
 * breaks the esbuild build), so this worker re-implements the tiny guard inline:
 * a bearer token (native callers send no `Origin`, so the origin check would give
 * them zero auth), the Cloudflare native rate-limit binding, a body cap, and CORS.
 */
export interface Env {
  /** `wrangler secret put APP_API_TOKEN` — the app bearer gate. */
  APP_API_TOKEN?: string;
  /** Cloudflare native rate-limit binding (`[[ratelimit]]` in wrangler.toml). Optional. */
  AGENT_RATELIMIT?: {
    limit: (o: { key: string }) => Promise<{ success: boolean }>;
  };
  /** The EU D1 (`[[d1_databases]] binding = "DB"`) — one database, five tables
   *  (admin_audit · session_events · security_events · consent_events · csp_reports).
   *  Optional (503 until bound). */
  DB?: D1Database;
  /** KV (`binding = "SECURITY_COUNTERS"`) — ephemeral TTL counters for failed-login rates,
   *  so they're counted at the edge, not written per-request to D1. Optional. */
  SECURITY_COUNTERS?: KVNamespace;
  /** `wrangler secret put IP_HASH_SALT` — salt for hashing IPs before storage (never raw). */
  IP_HASH_SALT?: string;
  /** `wrangler secret put GDPR_FINGERPRINT_SALT` — salt for the email pseudonymisation
   *  fingerprint on user_profiles/consent/erasure. MUST be identical across envs.
   *  Optional (fingerprints are left null until set). */
  GDPR_FINGERPRINT_SALT?: string;
  /** `wrangler secret put CLERK_WEBHOOK_SECRET` — Svix signing secret (`whsec_…`) for
   *  `POST /v1/clerk-webhook`. Optional (503 until set). */
  CLERK_WEBHOOK_SECRET?: string;
  /** Sanity read config for `GET /v1/announcements` (`[vars]`). Public read → 503 until set. */
  SANITY_PROJECT_ID?: string;
  SANITY_DATASET?: string;
  SANITY_API_VERSION?: string;
  /** `wrangler secret put SANITY_API_READ_TOKEN` — server-side read token (never shipped to clients). */
  SANITY_API_READ_TOKEN?: string;
}

// Browser-context origins allowed to READ the response (dev + the electron renderer
// dev server). Native (RN) and the electron MAIN process send no Origin and need no CORS.
const ALLOWED_ORIGINS = new Set([
  "http://localhost:3000",
  "http://localhost:5173",
]);
const BODY_MAX = 4000;

function corsHeaders(origin: string | null): Record<string, string> {
  if (origin && ALLOWED_ORIGINS.has(origin))
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

/**
 * Verify a Svix (Clerk) webhook signature with Web Crypto — no `svix` dependency. The
 * signed content is `${id}.${timestamp}.${body}`; the secret is `whsec_<base64>`,
 * HMAC-SHA256 over that content, compared constant-time against any `v1,<sig>` in the
 * space-separated `svix-signature` header. Rejects timestamps outside a 5-minute window
 * (replay protection).
 */
async function verifySvix(
  secret: string,
  id: string,
  timestamp: string,
  signatureHeader: string,
  body: string,
): Promise<boolean> {
  const ts = Number(timestamp);
  if (!Number.isFinite(ts) || Math.abs(Date.now() / 1000 - ts) > 300)
    return false;
  try {
    // A malformed secret makes atob throw — fail closed, never let it 500 the route.
    const secretBytes = Uint8Array.from(
      atob(secret.replace(/^whsec_/, "")),
      (c) => c.charCodeAt(0),
    );
    const key = await crypto.subtle.importKey(
      "raw",
      secretBytes,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );
    const mac = await crypto.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(`${id}.${timestamp}.${body}`),
    );
    const expected = btoa(String.fromCharCode(...new Uint8Array(mac)));
    // Header is space-separated "v1,<base64sig> v1,<base64sig>"; match any version-1 sig.
    return signatureHeader.split(" ").some((part) => {
      const [version, sig] = part.split(",");
      return version === "v1" && sig !== undefined && safeEqual(sig, expected);
    });
  } catch {
    return false;
  }
}

function json(
  body: unknown,
  status: number,
  cors: Record<string, string>,
): Response {
  // no-store: every route through this helper is a bearer-gated view or a signed
  // webhook — admin data + mutations that must never be cached by an intermediary.
  // (The PUBLIC reads — /v1/geo, /v1/announcements — build their own cacheable Response.)
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
      ...cors,
    },
  });
}

// The announcements read is PUBLIC content (same as on the public website), so it
// answers any origin — unlike the bearer-gated /v1/* routes above.
const PUBLIC_CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, OPTIONS",
  "access-control-allow-headers": "content-type",
};

/** One GROQ round-trip → both singletons. `apicdn` (cached) for public reads; the
 *  authenticated `api` host + token when a read token is set (private dataset). */
async function fetchAnnouncementDocs(
  env: Env,
): Promise<{ banner: RawBanner; toast: RawToast } | null> {
  const version = env.SANITY_API_VERSION || "2025-01-01";
  const token = env.SANITY_API_READ_TOKEN;
  const host = token
    ? `${env.SANITY_PROJECT_ID}.api.sanity.io`
    : `${env.SANITY_PROJECT_ID}.apicdn.sanity.io`;
  const query = `{ "banner": ${bannerQuery}, "toast": ${toastQuery} }`;
  const endpoint = `https://${host}/v${version}/data/query/${env.SANITY_DATASET}?query=${encodeURIComponent(query)}`;
  const res = await fetch(
    endpoint,
    token ? { headers: { authorization: `Bearer ${token}` } } : undefined,
  );
  if (!res.ok) throw new Error(`sanity ${res.status}`);
  const body = (await res.json()) as {
    result?: { banner: RawBanner; toast: RawToast };
  };
  return body.result ?? null;
}

export default {
  async fetch(
    request: Request,
    env: Env,
    _ctx: ExecutionContext,
  ): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/health") {
      // Public uptime check stays minimal; a bearer-authed caller (the admin System
      // screen) also gets per-binding DB status via a cheap `SELECT 1`.
      const bearer = (request.headers.get("authorization") ?? "").replace(
        /^Bearer\s+/i,
        "",
      );
      const authed =
        env.APP_API_TOKEN && bearer && safeEqual(bearer, env.APP_API_TOKEN);
      if (!authed) return Response.json({ ok: true });
      const dbStatus = async (db: D1Database | undefined): Promise<string> => {
        if (!db) return "unbound";
        try {
          await db.prepare("SELECT 1").first();
          return "ok";
        } catch {
          return "error";
        }
      };
      return Response.json({ ok: true, db: await dbStatus(env.DB) });
    }

    const cors = corsHeaders(request.headers.get("origin"));

    // ── Audit + session events — POST /v1/events (bearer-gated; writes the EU D1) ──
    if (url.pathname === "/v1/events") {
      if (request.method === "OPTIONS")
        return new Response(null, { status: 204, headers: cors });
      if (request.method !== "POST")
        return json({ error: "method_not_allowed" }, 405, cors);

      const bearer = (request.headers.get("authorization") ?? "").replace(
        /^Bearer\s+/i,
        "",
      );
      if (
        !env.APP_API_TOKEN ||
        !bearer ||
        !safeEqual(bearer, env.APP_API_TOKEN)
      )
        return json({ error: "unauthorized" }, 401, cors);

      if (env.AGENT_RATELIMIT) {
        const { success } = await env.AGENT_RATELIMIT.limit({
          key: clientIp(request),
        });
        if (!success) return json({ error: "rate_limited" }, 429, cors);
      }
      if (Number(request.headers.get("content-length") ?? 0) > BODY_MAX)
        return json({ error: "too_large" }, 413, cors);

      let body: Record<string, unknown>;
      try {
        const text = await request.text();
        if (new TextEncoder().encode(text).length > BODY_MAX)
          return json({ error: "too_large" }, 413, cors);
        body = text ? (JSON.parse(text) as Record<string, unknown>) : {};
      } catch {
        return json({ error: "invalid" }, 400, cors);
      }
      const str = (v: unknown, max = 128): string =>
        typeof v === "string" ? v.slice(0, max) : "";
      // Country: a trusted first-party server may pass the real user's; devices call
      // direct, so their edge header is correct. Never a raw IP is stored.
      const country =
        str(body.country, 2) || request.headers.get("cf-ipcountry") || null;
      const ts = new Date().toISOString();

      try {
        if (body.kind === "admin") {
          if (!env.DB) return json({ error: "unavailable" }, 503, cors);
          const event = str(body.event, 32);
          const actor = str(body.actorUserId);
          const target = str(body.targetUserId);
          if (!event || !actor || !target)
            return json({ error: "invalid" }, 400, cors);
          // No IP for admin actions — the userId is the identity (minimization).
          await env.DB.prepare(
            "INSERT INTO admin_audit (ts, event, actor_user_id, target_user_id, country, ip_hash) VALUES (?, ?, ?, ?, ?, NULL)",
          )
            .bind(ts, event, actor, target, country)
            .run();
        } else if (body.kind === "session") {
          if (!env.DB) return json({ error: "unavailable" }, 503, cors);
          const surface = str(body.surface, 16);
          const userId = str(body.userId);
          if (!surface || !userId) return json({ error: "invalid" }, 400, cors);
          // The Clerk session id → the stored row is revocable from the admin screen.
          const sessionId = str(body.sessionId, 64) || null;
          // Session events arrive from the device direct → hash ITS IP (never raw).
          const ip = clientIp(request);
          const ipHash =
            env.IP_HASH_SALT && ip !== "unknown"
              ? await hashIpAddress(ip, env.IP_HASH_SALT)
              : null;
          await env.DB.prepare(
            "INSERT INTO session_events (ts, surface, user_id, session_id, country, ip_hash) VALUES (?, ?, ?, ?, ?, ?)",
          )
            .bind(ts, surface, userId, sessionId, country, ipHash)
            .run();
          // Create the profile row on first sign-in; refresh last_login_at on
          // every sign-in. Email/name are NOT in the session payload (kept
          // minimal) — the Clerk webhook + backfill fill them. Idempotent by PK.
          await env.DB.prepare(
            "INSERT INTO user_profiles (user_id, created_at, last_login_at) VALUES (?, ?, ?) " +
              "ON CONFLICT(user_id) DO UPDATE SET last_login_at = excluded.last_login_at",
          )
            .bind(userId, ts, ts)
            .run();
        } else if (body.kind === "security") {
          // App-level security incident (failed login, priv-esc, exfil, …) — the EU D1.
          // Low-volume by design; the edge firehose stays in Cloudflare's Security Events.
          if (!env.DB) return json({ error: "unavailable" }, 503, cors);
          const eventType = str(body.eventType, 32);
          const severity = str(body.severity, 10);
          if (!eventType || !severity)
            return json({ error: "invalid" }, 400, cors);
          const secSurface = str(body.surface, 16) || null;
          const secUserId = str(body.userId) || null;
          const ip = clientIp(request);
          const ipHash =
            env.IP_HASH_SALT && ip !== "unknown"
              ? await hashIpAddress(ip, env.IP_HASH_SALT)
              : null;
          const insertSecurity = (
            et: string,
            sev: string,
            desc: string | null,
          ) =>
            env
              .DB!.prepare(
                "INSERT INTO security_events (ts, event_type, severity, surface, user_id, country, ip_hash, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
              )
              .bind(ts, et, sev, secSurface, secUserId, country, ipHash, desc)
              .run();

          // Failed logins are COUNTED in KV (cheap, ephemeral), NOT written per-request to
          // D1. Only when a count crosses the threshold do we store ONE credential_stuffing
          // incident — keeping the EU D1 low-volume by design. Count per SOURCE (hashed IP)
          // AND per ACCOUNT (user id), escalating if EITHER crosses: a spray hits many
          // accounts from one source (the source key catches it) and a single-account brute
          // force hits one account from many sources (the user key catches it). Never key on
          // a RAW IP — KV is globally replicated, so a raw IP would leave the EU region.
          if (eventType === "failed_login" && env.SECURITY_COUNTERS) {
            const keys = [
              ipHash ? `fl:ip:${ipHash}` : null,
              secUserId ? `fl:user:${secUserId}` : null,
            ].filter((k): k is string => k !== null);
            if (keys.length === 0)
              return json({ ok: true, counted: 0 }, 202, cors);
            let peak = 0;
            for (const k of keys) {
              const c = await bumpCounter(
                env.SECURITY_COUNTERS,
                k,
                FAILED_LOGIN.windowSeconds,
              );
              if (c > peak) peak = c;
            }
            const incident = classifyFailedLogins(peak);
            if (!incident) return json({ ok: true, counted: peak }, 202, cors);
            await insertSecurity(
              incident.eventType,
              incident.severity,
              `${peak} failed logins in ${FAILED_LOGIN.windowSeconds}s`,
            );
            return json({ ok: true, escalated: true }, 201, cors);
          }

          // Every other incident is already low-volume (one per real event) → store directly.
          await insertSecurity(
            eventType,
            severity,
            str(body.description, 200) || null,
          );
        } else if (body.kind === "consent") {
          if (!env.DB) return json({ error: "unavailable" }, 503, cors);
          // Trust boundary: userId is resolved by the caller's route via Clerk
          // auth(), never claimed by the browser. Anonymous rows key on consentId.
          const userId = str(body.userId) || null;
          const consentId = str(body.consentId, 64) || null;
          const subjectId = userId ?? consentId;
          const decisionId = str(body.decisionId, 64);
          const policyVersion = str(body.policyVersion, 32);
          const surface = str(body.surface, 16);
          const events = Array.isArray(body.events) ? body.events : [];
          if (
            !subjectId ||
            !decisionId ||
            !policyVersion ||
            !surface ||
            events.length === 0
          )
            return json({ error: "invalid" }, 400, cors);
          const source = str(body.source, 16) || null;
          const subjectType = userId ? "user" : "visitor";
          // Link a logged-in consent row to the erasure key (null until the
          // profile is fingerprinted by the Clerk webhook / backfill).
          let fingerprint: string | null = null;
          if (userId) {
            const prof = await env.DB.prepare(
              "SELECT email_fingerprint FROM user_profiles WHERE user_id = ?",
            )
              .bind(userId)
              .first<{ email_fingerprint: string | null }>();
            fingerprint = prof?.email_fingerprint ?? null;
          }
          const ALLOWED_CONSENT_TYPES = new Set([
            "cookie_analytics",
            "cookie_marketing",
            "marketing_email",
            "terms",
            "privacy",
            "content_guidelines",
          ]);
          for (const raw of events as Array<{
            type?: unknown;
            granted?: unknown;
          }>) {
            const type = str(raw.type, 32);
            if (!ALLOWED_CONSENT_TYPES.has(type)) continue;
            await env.DB.prepare(
              "INSERT OR IGNORE INTO consent_events (ts, subject_type, subject_id, email_fingerprint, consent_type, granted, policy_version, surface, source, country, ip_hash, idempotency_key) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            )
              .bind(
                ts,
                subjectType,
                subjectId,
                fingerprint,
                type,
                raw.granted ? 1 : 0,
                policyVersion,
                surface,
                source,
                country,
                // The website proxies this write (website server -> api), so
                // the api's edge IP is the server, not the visitor — the same
                // reason `country` is forwarded in the body instead of read
                // from the edge. Store null rather than a misleading
                // per-subject hash. When native surfaces call the api
                // directly (a deferred fast-follow), that path can hash the
                // real device IP.
                null,
                `${decisionId}:${type}`,
              )
              .run();
          }
        } else if (body.kind === "csp-report") {
          // CSP violations, sanitized upstream by the surface route (routes
          // collapsed, tokens stripped, samples redacted). Aggregate on write:
          // one row per distinct group, count incremented. No IP/country — a CSP
          // violation is about a resource, not a subject.
          if (!env.DB) return json({ error: "unavailable" }, 503, cors);
          const reports = Array.isArray(body.reports)
            ? body.reports.slice(0, 10)
            : [];
          if (reports.length === 0)
            return json({ error: "invalid" }, 400, cors);
          for (const raw of reports as Array<Record<string, unknown>>) {
            const surface = str(raw.surface, 16);
            const disposition =
              str(raw.disposition, 8) === "enforce" ? "enforce" : "report";
            const directive = str(raw.directive, 48);
            const documentPath = str(raw.documentPath, 256);
            const blockedSource = str(raw.blockedSource, 256);
            if (!surface || !directive || !documentPath || !blockedSource)
              continue;
            const groupKey = `${surface}|${disposition}|${directive}|${documentPath}|${blockedSource}`;
            const sampleSourceFile = str(raw.sampleSourceFile, 256) || null;
            const sampleLine =
              typeof raw.sampleLine === "number" ? raw.sampleLine : null;
            const sampleSnippet = str(raw.sampleSnippet, 60) || null;
            await env.DB.prepare(
              "INSERT INTO csp_reports (group_key, first_seen, last_seen, count, surface, disposition, directive, document_path, blocked_source, sample_source_file, sample_line, sample_snippet) " +
                "VALUES (?, ?, ?, 1, ?, ?, ?, ?, ?, ?, ?, ?) " +
                "ON CONFLICT(group_key) DO UPDATE SET count = count + 1, last_seen = excluded.last_seen, sample_source_file = excluded.sample_source_file, sample_line = excluded.sample_line, sample_snippet = excluded.sample_snippet",
            )
              .bind(
                groupKey,
                ts,
                ts,
                surface,
                disposition,
                directive,
                documentPath,
                blockedSource,
                sampleSourceFile,
                sampleLine,
                sampleSnippet,
              )
              .run();
          }
        } else {
          return json({ error: "invalid" }, 400, cors);
        }
      } catch (error) {
        logger.error("audit write failed", { name: (error as Error)?.name });
        return json({ error: "server" }, 502, cors);
      }
      return json({ ok: true }, 201, cors);
    }

    // ── Sessions view — GET /v1/sessions (bearer-gated; recent activity for admin) ──
    if (url.pathname === "/v1/sessions") {
      if (request.method !== "GET")
        return json({ error: "method_not_allowed" }, 405, cors);
      const bearer = (request.headers.get("authorization") ?? "").replace(
        /^Bearer\s+/i,
        "",
      );
      if (
        !env.APP_API_TOKEN ||
        !bearer ||
        !safeEqual(bearer, env.APP_API_TOKEN)
      )
        return json({ error: "unauthorized" }, 401, cors);
      if (!env.DB) return json({ error: "unavailable" }, 503, cors);
      // Clamp BOTH ends: a negative limit would become SQLite `LIMIT -1` (unbounded scan).
      const limit = Math.max(
        1,
        Math.min(Number(url.searchParams.get("limit") ?? 50) || 50, 200),
      );
      try {
        // No ip_hash in the projection — the admin view needs surface/user/session/country.
        const { results } = await env.DB.prepare(
          "SELECT ts, surface, user_id, session_id, country FROM session_events ORDER BY ts DESC LIMIT ?",
        )
          .bind(limit)
          .all();
        return json({ data: results }, 200, cors);
      } catch (error) {
        logger.error("sessions read failed", { name: (error as Error)?.name });
        return json({ error: "server" }, 502, cors);
      }
    }

    // ── Security view — GET /v1/security (bearer-gated; recent incidents for admin) ──
    if (url.pathname === "/v1/security") {
      if (request.method !== "GET")
        return json({ error: "method_not_allowed" }, 405, cors);
      const bearer = (request.headers.get("authorization") ?? "").replace(
        /^Bearer\s+/i,
        "",
      );
      if (
        !env.APP_API_TOKEN ||
        !bearer ||
        !safeEqual(bearer, env.APP_API_TOKEN)
      )
        return json({ error: "unauthorized" }, 401, cors);
      if (!env.DB) return json({ error: "unavailable" }, 503, cors);
      // Clamp BOTH ends: a negative limit would become SQLite `LIMIT -1` (unbounded scan).
      const limit = Math.max(
        1,
        Math.min(Number(url.searchParams.get("limit") ?? 50) || 50, 200),
      );
      try {
        // No ip_hash in the projection — the admin view is data-minimized.
        const { results } = await env.DB.prepare(
          "SELECT ts, event_type, severity, surface, user_id, country, description FROM security_events ORDER BY ts DESC LIMIT ?",
        )
          .bind(limit)
          .all();
        return json({ data: results }, 200, cors);
      } catch (error) {
        logger.error("security read failed", { name: (error as Error)?.name });
        return json({ error: "server" }, 502, cors);
      }
    }

    // ── CSP reports view — GET /v1/csp-reports (bearer-gated; enforce-readiness for admin) ──
    if (url.pathname === "/v1/csp-reports") {
      if (request.method !== "GET")
        return json({ error: "method_not_allowed" }, 405, cors);
      const bearer = (request.headers.get("authorization") ?? "").replace(
        /^Bearer\s+/i,
        "",
      );
      if (
        !env.APP_API_TOKEN ||
        !bearer ||
        !safeEqual(bearer, env.APP_API_TOKEN)
      )
        return json({ error: "unauthorized" }, 401, cors);
      if (!env.DB) return json({ error: "unavailable" }, 503, cors);
      // Clamp BOTH ends: a negative limit would become SQLite `LIMIT -1` (unbounded scan).
      const limit = Math.max(
        1,
        Math.min(Number(url.searchParams.get("limit") ?? 100) || 100, 200),
      );
      try {
        const { results } = await env.DB.prepare(
          "SELECT group_key, count, disposition, directive, document_path, blocked_source, surface, first_seen, last_seen, sample_source_file, sample_line, sample_snippet FROM csp_reports ORDER BY count DESC, last_seen DESC LIMIT ?",
        )
          .bind(limit)
          .all();
        return json({ data: results }, 200, cors);
      } catch (error) {
        logger.error("csp-reports read failed", {
          name: (error as Error)?.name,
        });
        return json({ error: "server" }, 502, cors);
      }
    }

    // ── Clerk webhook — POST /v1/clerk-webhook (Svix-signed; server-verified events) ──
    // Fail-closed: no secret set → 503; bad signature → 401. Records only genuinely
    // security-relevant, non-redundant signals — chiefly a role→admin grant made OUTSIDE
    // our admin UI (e.g. directly in the Clerk dashboard), which our own audit would miss.
    if (url.pathname === "/v1/clerk-webhook") {
      if (request.method !== "POST")
        return json({ error: "method_not_allowed" }, 405, cors);
      if (!env.CLERK_WEBHOOK_SECRET)
        return json({ error: "unavailable" }, 503, cors);
      // Cap before the read (like /v1/events) so an unauthenticated caller can't force a
      // full body read + HMAC on an oversized payload.
      if (Number(request.headers.get("content-length") ?? 0) > BODY_MAX)
        return json({ error: "too_large" }, 413, cors);
      const svixId = request.headers.get("svix-id");
      const svixTs = request.headers.get("svix-timestamp");
      const svixSig = request.headers.get("svix-signature");
      const raw = await request.text();
      if (new TextEncoder().encode(raw).length > BODY_MAX)
        return json({ error: "too_large" }, 413, cors);
      if (
        !svixId ||
        !svixTs ||
        !svixSig ||
        !(await verifySvix(
          env.CLERK_WEBHOOK_SECRET,
          svixId,
          svixTs,
          svixSig,
          raw,
        ))
      )
        return json({ error: "unauthorized" }, 401, cors);

      let evt: { type?: string; data?: Record<string, unknown> };
      try {
        evt = JSON.parse(raw) as typeof evt;
      } catch {
        return json({ error: "invalid" }, 400, cors);
      }

      // The one wired mapping: a role→admin grant that did NOT go through our admin action.
      const data = evt.data ?? {};
      const role = (data.public_metadata as { role?: string } | undefined)
        ?.role;
      if (evt.type === "user.updated" && role === "admin" && env.DB) {
        try {
          await env.DB.prepare(
            "INSERT INTO security_events (ts, event_type, severity, surface, user_id, country, ip_hash, description) VALUES (?, ?, ?, ?, ?, ?, NULL, ?)",
          )
            .bind(
              new Date().toISOString(),
              "privilege_escalation",
              "high",
              "api",
              typeof data.id === "string" ? data.id : null,
              request.headers.get("cf-ipcountry") ?? null,
              "role→admin via Clerk (out-of-band)",
            )
            .run();
        } catch (error) {
          logger.error("clerk webhook write failed", {
            name: (error as Error)?.name,
          });
          return json({ error: "server" }, 502, cors);
        }
      }

      // ── Compliance: keep user_profiles in sync with Clerk (source of truth for
      //    email). Upsert on create/update (re-fingerprints on email change);
      //    pseudonymise on delete. Idempotent by PK — Clerk retries are safe.
      //    No idempotency-key store: every op here is idempotent by primary key.
      if (
        env.DB &&
        (evt.type === "user.created" ||
          evt.type === "user.updated" ||
          evt.type === "user.deleted")
      ) {
        const userId = typeof data.id === "string" ? data.id : null;
        if (userId) {
          const now = new Date().toISOString();
          try {
            if (evt.type === "user.deleted") {
              await env.DB.prepare(
                "UPDATE user_profiles SET email = ?, full_name = ?, deleted_at = ?, anonymized = 1 WHERE user_id = ?",
              )
                .bind(
                  `deleted_${userId}@anonymized.local`,
                  "Deleted User",
                  now,
                  userId,
                )
                .run();
            } else {
              // Webhook payload is snake_case (unlike the @clerk/backend SDK).
              const emails =
                (data.email_addresses as
                  Array<{ id?: string; email_address?: string }> | undefined) ??
                [];
              const primaryId = data.primary_email_address_id as
                string | undefined;
              const email =
                emails.find((e) => e.id === primaryId)?.email_address ??
                emails[0]?.email_address ??
                null;
              const first =
                typeof data.first_name === "string" ? data.first_name : "";
              const last =
                typeof data.last_name === "string" ? data.last_name : "";
              const fullName = [first, last].filter(Boolean).join(" ") || null;
              const fingerprint =
                email && env.GDPR_FINGERPRINT_SALT
                  ? await fingerprintEmail(email, env.GDPR_FINGERPRINT_SALT)
                  : null;
              // COALESCE guards email + email_fingerprint: a degenerate payload with no
              // resolvable email must not clear the stored ones. The fingerprint is the
              // erasure key, so losing it breaks email-keyed erasure. A real incoming
              // email still overwrites, via excluded. full_name has no such guard —
              // a name clear/update should propagate; it is not the erasure key.
              await env.DB.prepare(
                "INSERT INTO user_profiles (user_id, email, full_name, email_fingerprint, created_at, last_login_at) " +
                  "VALUES (?, ?, ?, ?, ?, NULL) " +
                  "ON CONFLICT(user_id) DO UPDATE SET email = COALESCE(excluded.email, email), full_name = excluded.full_name, email_fingerprint = COALESCE(excluded.email_fingerprint, email_fingerprint)",
              )
                .bind(userId, email, fullName, fingerprint, now)
                .run();
            }
          } catch (error) {
            logger.error("clerk profile sync failed", {
              name: (error as Error)?.name,
            });
            return json({ error: "server" }, 502, cors);
          }
        }
      }
      return json({ ok: true }, 200, cors);
    }

    // ── Geo → consent mode — GET /v1/geo (PUBLIC; the native surfaces' geo signal) ──
    // Echoes the caller's edge country + the resolved consent mode so mobile/hybrid (which
    // have no CF headers of their own) can geo-gate their consent banner. The web surfaces
    // read `cf-ipcountry` server-side directly; this is only for the native clients. No
    // bearer (no PII — just the country), no DB. Unknown geo → the resolver returns opt-in.
    if (url.pathname === "/v1/geo") {
      if (request.method === "OPTIONS")
        return new Response(null, { status: 204, headers: PUBLIC_CORS });
      if (request.method !== "GET")
        return json({ error: "method_not_allowed" }, 405, PUBLIC_CORS);
      const country = request.headers.get("cf-ipcountry") || null;
      const reg = resolveRegulation(country);
      return new Response(
        JSON.stringify({ country, regulation: reg.name, mode: reg.mode }),
        {
          status: 200,
          headers: {
            "content-type": "application/json",
            "cache-control": "public, max-age=3600",
            ...PUBLIC_CORS,
          },
        },
      );
    }

    // ── Announcements — GET /v1/announcements (PUBLIC; banner + toast per surface) ──
    // Serves the same Sanity content the website reads server-side, to the client-gated
    // surfaces (app, hybrid, mobile). No bearer: it is public marketing content.
    if (url.pathname === "/v1/announcements") {
      if (request.method === "OPTIONS")
        return new Response(null, { status: 204, headers: PUBLIC_CORS });
      if (request.method !== "GET")
        return json({ error: "method_not_allowed" }, 405, PUBLIC_CORS);

      const surfaceParam = url.searchParams.get("surface") ?? "";
      if (!SURFACES.includes(surfaceParam as Surface))
        return json({ error: "invalid_surface" }, 400, PUBLIC_CORS);
      const surface = surfaceParam as Surface;
      // Unknown locales fall back to the default copy inside the resolver.
      const locale = (url.searchParams.get("locale") ||
        defaultLocale) as Locale;

      if (!env.SANITY_PROJECT_ID || !env.SANITY_DATASET)
        return json({ error: "unavailable" }, 503, PUBLIC_CORS);

      try {
        const raw = await fetchAnnouncementDocs(env);
        const payload = {
          banner: resolveBanner(raw?.banner ?? null, { locale, surface }),
          toast: resolveToast(raw?.toast ?? null, { locale, surface }),
        };
        return new Response(JSON.stringify(payload), {
          status: 200,
          headers: {
            "content-type": "application/json",
            "cache-control": "public, max-age=60",
            ...PUBLIC_CORS,
          },
        });
      } catch (error) {
        logger.error("announcements read failed", {
          name: (error as Error)?.name,
        });
        return json({ error: "server" }, 502, PUBLIC_CORS);
      }
    }

    logger.info("api request", {
      method: request.method,
      pathname: url.pathname,
    });
    return new Response("Not found", { status: 404 });
  },
} satisfies ExportedHandler<Env>;

/**
 * Route the standalone API worker's HTTP requests.
 *
 * @see docs/reference/shared/api/src/index.md
 */
import { addTransport, logger } from "@indiecrafts/packages-shared-logger";
import { cloudflareTransport } from "@indiecrafts/packages-shared-logger/cloudflare";
import {
  getCurrentEnvironment,
  defaultLocale,
  isLocale,
  localeCodes,
  type Locale,
  SETTINGS,
  coerceSetting,
  effectiveSettings,
  type SettingKey,
} from "@indiecrafts/packages-shared-config";
import {
  hashIpAddress,
  fingerprintEmail,
} from "@indiecrafts/packages-shared-security/crypto";
import {
  classifyFailedLogins,
  FAILED_LOGIN,
  bumpCounter,
  shouldAlert,
} from "@indiecrafts/packages-shared-security-events";
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
import {
  errorFromThrow,
  fetchWithTimeout,
  finalize,
  requestIdOf,
} from "./http";
import { withIdempotency } from "./idempotency";
import { handleErasureRequest } from "./erasure/request";
import { handleErasureConfirm } from "./erasure/confirm";
import { handleErasureStatus } from "./erasure/status";
import { handleErasureSelf } from "./erasure/self";
import { handleClerkUserDeleted } from "./erasure/clerk-deleted";
import { handleClerkEmail } from "./clerk-email/handle";
import { sendWelcomeEmail } from "./clerk-email/welcome";
import { upsertResendContact } from "./resend-audience";
import { handleMarketingConsent } from "./consent/marketing";
import { handleLegalConsent } from "./consent/legal";
import {
  handleEmailPreferences,
  handleTokenPreferences,
  handleOneClickUnsubscribe,
} from "./consent/email-preferences";
import { writePreferences } from "./consent/email-preferences-store";
import { fetchEmailPreferences } from "./consent/email-preferences-sanity";
import { handleExport, handleExportDownload } from "./export/route";
import {
  handleDataRequestWrite,
  handleDataRequestList,
} from "./data-request/route";
import {
  handleDataRequestDetail,
  handleDataRequestStatus,
} from "./data-request/status";
import { sendSecurityAlertEmail } from "./security/alert";
import { readChurnAggregate } from "./consent/churn-store";
import { cronStatus, erasureRequests, forwardCronRun } from "./monitoring";
import { handleErasureClose, handleErasureRetry } from "./erasure/admin";
import { readSettings } from "./settings-cache";

// Production console is silent (no request-log noise); this forwards error/fatal to
// Workers Logs anyway. Non-prod skips it — its console already shows errors.
if (getCurrentEnvironment() === "production")
  addTransport(cloudflareTransport());

/**
 * HTTP API worker — a **bare** Cloudflare Worker (no Next/OpenNext). The shared,
 * versioned API for the web surfaces and partners. Serves `POST /v1/events` (the audit +
 * session-event sink → the EU D1).
 * Real logic lives in bricks imported `workspace:*`. Run `pnpm cf-typegen` after editing
 * bindings in wrangler.toml.
 *
 * `withGuard` (@indiecrafts/packages-shared-security) is Next-only (`server-only`
 * breaks the esbuild build), so this worker re-implements the tiny guard inline:
 * a bearer token (server-to-server callers send no `Origin`, so an origin check would
 * give them zero auth), the Cloudflare rate-limit binding, a body cap, and CORS.
 */
export interface Env {
  /** `wrangler secret put APP_API_TOKEN` — the TRUSTED admin/backend bearer. Gates every
   *  admin read/write route AND the privileged `/v1/events` kinds (`admin` · `consent` ·
   *  `csp-report`). Server-side only — NEVER ship it in a client bundle. */
  APP_API_TOKEN?: string;
  /** Cloudflare native rate-limit binding (`[[env.<env>.unsafe.bindings]] name = "RATELIMIT"` in wrangler.toml). Optional. */
  RATELIMIT?: {
    limit: (o: { key: string }) => Promise<{ success: boolean }>;
  };
  /** The EU D1 (`[[d1_databases]] binding = "AUDIT_DB"`) — append-only telemetry firehose:
   *  admin_audit · session_events · security_events · csp_reports · backup_runs.
   *  Optional (503 until bound). */
  AUDIT_DB?: D1Database;
  /** EU D1 (binding MAIN_DB) — identity/rights/settings: user_profiles, consent_events,
   *  data_requests, erasure_requests, export_requests, site_settings. */
  MAIN_DB?: D1Database;
  /** KV (`binding = "SECURITY_COUNTERS"`) — ephemeral TTL counters for failed-login rates,
   *  so they're counted at the edge, not written per-request to D1. Optional. */
  SECURITY_COUNTERS?: KVNamespace;
  /** `wrangler secret put IP_HASH_SALT` — salt for hashing IPs before storage (never raw). */
  IP_HASH_SALT?: string;
  /** `wrangler secret put GDPR_FINGERPRINT_SALT` — salt for the email pseudonymisation
   *  fingerprint on user_profiles/consent/erasure. DISTINCT per env, generated
   *  independently; STABLE within an env — never rotate a live one (it orphans every
   *  email-keyed lookup). Optional (fingerprints are left null until set). */
  GDPR_FINGERPRINT_SALT?: string;
  /** `wrangler secret put PII_ENCRYPTION_KEY` — AES-256-GCM key for reversible at-rest
   *  encryption of the operational plaintext PII in `data_requests` (the replyable email +
   *  free-text message). Unset → those fields store plaintext (backward compatible); the
   *  read path decrypts either. Server-side only; distinct from the fingerprint salts. */
  PII_ENCRYPTION_KEY?: string;
  /** `wrangler secret put CLERK_WEBHOOK_SECRET` — Svix signing secret (`whsec_…`) for
   *  `POST /v1/clerk-webhook`. Optional (503 until set). */
  CLERK_WEBHOOK_SECRET?: string;
  /** `wrangler secret put CLERK_SECRET_KEY` — Clerk backend secret key for the erasure
   *  route's real Clerk client (find/export/delete a user by email). Optional until the
   *  confirm route runs erasure. */
  CLERK_SECRET_KEY?: string;
  /** Sanity read config for `GET /v1/announcements` (`[vars]`). Public read → 503 until set. */
  SANITY_PROJECT_ID?: string;
  SANITY_DATASET?: string;
  SANITY_API_VERSION?: string;
  /** `wrangler secret put SANITY_API_READ_TOKEN` — server-side read token (never shipped to clients). */
  SANITY_API_READ_TOKEN?: string;
  /** `wrangler secret put SANITY_API_WRITE_TOKEN` — write token for pseudonymising Sanity
   *  docs during erasure. Optional until the confirm route runs erasure. */
  SANITY_API_WRITE_TOKEN?: string;
  /** `wrangler secret put RESEND_API_KEY` — the erasure flow's token + completion emails.
   *  Optional: `erasure/email.ts` no-ops (never throws) until this AND `EMAIL_FROM` are set. */
  RESEND_API_KEY?: string;
  /** `[vars]` in wrangler.toml — the outbound From address (`no-reply@updates.indiecrafts.dev`,
   *  one Resend-verified domain across every env). Sends no-op until this AND `RESEND_API_KEY`
   *  are set. */
  EMAIL_FROM?: string;
  /** `[vars]` (or secret; an address, not sensitive) — BCC'd on every outbound email
   *  from this worker (the erasure emails). Operator-set. Optional — unset → no bcc.
   *  Composes with the website send layer's own `EMAIL_ADMIN_BCC` read. */
  EMAIL_ADMIN_BCC?: string;
  /** `[vars]` (or secret; an address, not sensitive) — the high/critical security-alert
   *  recipient. Optional — unset → falls back to `EMAIL_ADMIN_BCC`, and if that is also
   *  unset, the alert send no-ops (the incident is still written to D1). */
  SECURITY_ALERT_EMAIL?: string;
  /** The cron Worker, via a private service binding — `POST /v1/cron/run` (admin "Run now"). */
  CRON?: Fetcher;
  /** Stamped by `scripts/deploy/worker.mjs` (`--var`) — reported by the authed /health. */
  BUILD_VERSION?: string;
  BUILD_COMMIT?: string;
  /** `wrangler secret put TURNSTILE_SECRET` — the bot gate on the public erasure-request
   *  form. Optional (unset → the check passes; set → verified, fails closed on error). */
  TURNSTILE_SECRET?: string;
  /** The website's public origin (`[vars]`) — the erasure confirm-link target. Unset → falls
   *  back to the worker's own origin + `/v1/erasure/confirm` (the current behaviour). */
  WEBSITE_URL?: string;
  /** `wrangler secret put EMAIL_PREF_SECRET` — HMAC secret signing the no-login preference
   *  token (`consent/pref-token.ts`): the email-preferences GET/POST and one-click-unsubscribe
   *  routes below. Optional — those routes 503 until set. */
  EMAIL_PREF_SECRET?: string;
  /** R2 bucket for data-export bundles (`[[r2_buckets]] binding = "EXPORT_BUCKET"`),
   *  operator-provisioned. Optional — `/v1/export` routes answer 503 until bound. */
  EXPORT_BUCKET?: R2Bucket;
  /** `[vars]` — the R2 bucket name backups are uploaded to (informational; surfaced by
   *  `GET /v1/backups/status`, not read by this worker). Optional — null until set. */
  BACKUP_BUCKET?: string;
  /** `[vars]` — backup retention window in days (informational, surfaced by
   *  `GET /v1/backups/status`). Optional — defaults to 30. */
  BACKUP_RETENTION_DAYS?: string;
}

// Browser-context origins allowed to READ the response (dev). Server-to-server callers
// send no Origin and need no CORS.
const ALLOWED_ORIGINS = new Set(["http://localhost:3000"]);
/** Per-isolate settings cache for the monitoring routes (the SLA warning window). */
const monitoringSettings: Parameters<typeof readSettings>[1] = { value: null };
const BODY_MAX = 4000;
/** The Clerk webhook's own cap: an `email.created` event carries Clerk's rendered HTML
 *  (~12 KB for a verification code), so the 4 KB route cap would drop every auth email. */
const WEBHOOK_BODY_MAX = 64 * 1024;

export function corsHeaders(origin: string | null): Record<string, string> {
  if (origin && ALLOWED_ORIGINS.has(origin))
    return {
      "access-control-allow-origin": origin,
      "access-control-allow-headers": "authorization, content-type",
      "access-control-allow-methods": "POST, OPTIONS",
    };
  return {};
}

/** Constant-time compare — no early return, so timing doesn't leak the mismatch. */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export const clientIp = (req: Request): string =>
  req.headers.get("cf-connecting-ip") ?? "unknown";

/** The Bearer token from the Authorization header ("" when absent). */
function bearerToken(request: Request): string {
  return (request.headers.get("authorization") ?? "").replace(
    /^Bearer\s+/i,
    "",
  );
}

/** 401 unless the caller holds the trusted server token (`APP_API_TOKEN`); null when authorized. */
function requireAdminBearer(
  request: Request,
  env: Env,
  cors: Record<string, string>,
): Response | null {
  const bearer = bearerToken(request);
  if (!env.APP_API_TOKEN || !bearer || !safeEqual(bearer, env.APP_API_TOKEN))
    return json({ error: "unauthorized" }, 401, cors);
  return null;
}

/** 429 when the native rate-limit binding rejects this client; null when allowed or the
 *  binding is unbound. Applied on every bearer route so an extracted token can't hammer. */
async function rateLimit(
  request: Request,
  env: Env,
  cors: Record<string, string>,
): Promise<Response | null> {
  if (!env.RATELIMIT) return null;
  const { success } = await env.RATELIMIT.limit({
    key: clientIp(request),
  });
  return success ? null : json({ error: "rate_limited" }, 429, cors);
}

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
  // (The PUBLIC reads — /v1/announcements — build their own cacheable Response.)
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
export const PUBLIC_CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, OPTIONS",
  "access-control-allow-headers": "content-type",
};

// For the Clerk-JWT routes the browser calls directly (data export, self-erasure — on the
// website, the app, and the app inside the mobile WebView): the session token travels in
// `Authorization`, so the preflight must allow that header. `*` stays safe — the request is
// never credentialed (no cookies; the token is set explicitly), same as the consent routes.
export const PUBLIC_CORS_JWT = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "POST, OPTIONS",
  "access-control-allow-headers": "authorization, content-type",
  "access-control-expose-headers": "x-request-id",
};

// Same as PUBLIC_CORS, but for the public routes that also accept a POST body
// (the erasure-request form: GET renders it, POST submits it).
export const PUBLIC_CORS_POST = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, OPTIONS",
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
  const res = await fetchWithTimeout(
    endpoint,
    token ? { headers: { authorization: `Bearer ${token}` } } : undefined,
  );
  if (!res.ok) throw new Error(`sanity ${res.status}`);
  const body = (await res.json()) as {
    result?: { banner: RawBanner; toast: RawToast };
  };
  return body.result ?? null;
}

/** The router — every route. The default export wraps it with the request id, the
 *  top-level catch and `finalize` (src/http.ts). */
async function route(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
): Promise<Response> {
  const url = new URL(request.url);
  if (url.pathname === "/health") {
    // Public uptime check stays minimal; a bearer-authed caller (the admin System
    // screen) also gets both D1s (a `SELECT 1` each), the build and the bindings.
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
    const bound = (b: unknown) => (b ? "bound" : "unbound");
    const db = {
      audit: await dbStatus(env.AUDIT_DB),
      main: await dbStatus(env.MAIN_DB),
    };
    return Response.json({
      ok: db.audit !== "error" && db.main !== "error",
      version: env.BUILD_VERSION || "dev",
      commit: env.BUILD_COMMIT || "dev",
      db,
      bindings: {
        kv: bound(env.SECURITY_COUNTERS),
        exportBucket: bound(env.EXPORT_BUCKET),
        cron: bound(env.CRON),
        rateLimit: bound(env.RATELIMIT),
      },
    });
  }

  const cors = corsHeaders(request.headers.get("origin"));

  // ── Audit + session events — POST /v1/events (bearer-gated; writes the EU D1) ──
  if (url.pathname === "/v1/events") {
    if (request.method === "OPTIONS")
      return new Response(null, { status: 204, headers: cors });
    if (request.method !== "POST")
      return json({ error: "method_not_allowed" }, 405, cors);

    // Every caller is a first-party server holding APP_API_TOKEN — never a browser.
    const unauthorized = requireAdminBearer(request, env, cors);
    if (unauthorized) return unauthorized;

    const limited = await rateLimit(request, env, cors);
    if (limited) return limited;
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
    // Country: the calling server passes the real user's; else the edge header.
    // Never a raw IP is stored.
    const country =
      str(body.country, 2) || request.headers.get("cf-ipcountry") || null;
    const ts = new Date().toISOString();

    try {
      if (body.kind === "admin") {
        if (!env.AUDIT_DB) return json({ error: "unavailable" }, 503, cors);
        const event = str(body.event, 32);
        const actor = str(body.actorUserId);
        const target = str(body.targetUserId);
        if (!event || !actor || !target)
          return json({ error: "invalid" }, 400, cors);
        // No IP for admin actions — the userId is the identity (minimization).
        await env.AUDIT_DB.prepare(
          "INSERT INTO admin_audit (ts, event, actor_user_id, target_user_id, country, ip_hash) VALUES (?, ?, ?, ?, ?, NULL)",
        )
          .bind(ts, event, actor, target, country)
          .run();
      } else if (body.kind === "session") {
        if (!env.AUDIT_DB || !env.MAIN_DB)
          return json({ error: "unavailable" }, 503, cors);
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
        await env.AUDIT_DB.prepare(
          "INSERT INTO session_events (ts, surface, user_id, session_id, country, ip_hash) VALUES (?, ?, ?, ?, ?, ?)",
        )
          .bind(ts, surface, userId, sessionId, country, ipHash)
          .run();
        // Create the profile row on first sign-in; refresh last_login_at on
        // every sign-in. Email/name are NOT in the session payload (kept
        // minimal) — the Clerk webhook + backfill fill them. Idempotent by PK.
        await env.MAIN_DB.prepare(
          "INSERT INTO user_profiles (user_id, created_at, last_login_at) VALUES (?, ?, ?) " +
            "ON CONFLICT(user_id) DO UPDATE SET last_login_at = excluded.last_login_at",
        )
          .bind(userId, ts, ts)
          .run();
      } else if (body.kind === "security") {
        // App-level security incident (failed login, priv-esc, exfil, …) — the EU D1.
        // Low-volume by design; the edge firehose stays in Cloudflare's Security Events.
        if (!env.AUDIT_DB) return json({ error: "unavailable" }, 503, cors);
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
        const insertSecurity = async (
          et: string,
          sev: string,
          desc: string | null,
        ) => {
          await env
            .AUDIT_DB!.prepare(
              "INSERT INTO security_events (ts, event_type, severity, surface, user_id, country, ip_hash, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            )
            .bind(ts, et, sev, secSurface, secUserId, country, ipHash, desc)
            .run();
          // Alert the owner/DPO on high/critical incidents. Fired via waitUntil so
          // it never delays the response — the incident is already persisted.
          if (shouldAlert(sev)) {
            ctx.waitUntil(
              sendSecurityAlertEmail(env, {
                eventType: et,
                severity: sev,
                surface: secSurface,
                userId: secUserId,
                country,
                description: desc,
                ts,
              }),
            );
          }
        };

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
        if (!env.MAIN_DB) return json({ error: "unavailable" }, 503, cors);
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
          const prof = await env.MAIN_DB.prepare(
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
          await env.MAIN_DB.prepare(
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
              // per-subject hash.
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
        if (!env.AUDIT_DB) return json({ error: "unavailable" }, 503, cors);
        const reports = Array.isArray(body.reports)
          ? body.reports.slice(0, 10)
          : [];
        if (reports.length === 0) return json({ error: "invalid" }, 400, cors);
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
          await env.AUDIT_DB.prepare(
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
    const denied =
      requireAdminBearer(request, env, cors) ??
      (await rateLimit(request, env, cors));
    if (denied) return denied;
    if (!env.AUDIT_DB) return json({ error: "unavailable" }, 503, cors);
    // Clamp BOTH ends: a negative limit would become SQLite `LIMIT -1` (unbounded scan).
    const limit = Math.max(
      1,
      Math.min(Number(url.searchParams.get("limit") ?? 50) || 50, 200),
    );
    try {
      // No ip_hash in the projection — the admin view needs surface/user/session/country.
      const { results } = await env.AUDIT_DB.prepare(
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

  // ── Marketing-consent batch — POST /v1/profiles/consent (bearer; the admin users list) ──
  // Body { userIds: string[] } → { [userId]: 0 | 1 | null }. Unknown ids resolve to null.
  if (url.pathname === "/v1/profiles/consent") {
    if (request.method !== "POST")
      return json({ error: "method_not_allowed" }, 405, cors);
    const denied =
      requireAdminBearer(request, env, cors) ??
      (await rateLimit(request, env, cors));
    if (denied) return denied;
    if (!env.MAIN_DB) return json({ error: "unavailable" }, 503, cors);
    if (Number(request.headers.get("content-length") ?? 0) > BODY_MAX)
      return json({ error: "too_large" }, 413, cors);
    let body: { userIds?: unknown };
    try {
      // The content-length check above is a fast-path only — re-check the actual bytes
      // so a missing/lying header can't skip the cap.
      const text = await request.text();
      if (new TextEncoder().encode(text).length > BODY_MAX)
        return json({ error: "too_large" }, 413, cors);
      body = JSON.parse(text) as typeof body;
    } catch {
      return json({ error: "invalid" }, 400, cors);
    }
    const ids = Array.isArray(body.userIds)
      ? body.userIds
          .filter((x): x is string => typeof x === "string")
          .slice(0, 100)
      : [];
    if (ids.length === 0) return json({ error: "invalid" }, 400, cors);
    try {
      const placeholders = ids.map(() => "?").join(", ");
      const { results } = await env.MAIN_DB.prepare(
        `SELECT user_id, marketing_email FROM user_profiles WHERE user_id IN (${placeholders})`,
      )
        .bind(...ids)
        .all<{ user_id: string; marketing_email: number | null }>();
      const map: Record<string, number | null> = {};
      for (const id of ids) map[id] = null;
      for (const r of results) map[r.user_id] = r.marketing_email ?? null;
      return json(map, 200, cors);
    } catch (error) {
      logger.error("profiles consent read failed", {
        name: (error as Error)?.name,
      });
      return json({ error: "server" }, 502, cors);
    }
  }

  // ── Security view — GET /v1/security (bearer-gated; recent incidents for admin) ──
  if (url.pathname === "/v1/security") {
    if (request.method !== "GET")
      return json({ error: "method_not_allowed" }, 405, cors);
    const denied =
      requireAdminBearer(request, env, cors) ??
      (await rateLimit(request, env, cors));
    if (denied) return denied;
    if (!env.AUDIT_DB) return json({ error: "unavailable" }, 503, cors);
    // Clamp BOTH ends: a negative limit would become SQLite `LIMIT -1` (unbounded scan).
    const limit = Math.max(
      1,
      Math.min(Number(url.searchParams.get("limit") ?? 50) || 50, 200),
    );
    try {
      // No ip_hash in the projection — the admin view is data-minimized.
      const { results } = await env.AUDIT_DB.prepare(
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
    const denied =
      requireAdminBearer(request, env, cors) ??
      (await rateLimit(request, env, cors));
    if (denied) return denied;
    if (!env.AUDIT_DB) return json({ error: "unavailable" }, 503, cors);
    // Clamp BOTH ends: a negative limit would become SQLite `LIMIT -1` (unbounded scan).
    const limit = Math.max(
      1,
      Math.min(Number(url.searchParams.get("limit") ?? 100) || 100, 200),
    );
    try {
      const { results } = await env.AUDIT_DB.prepare(
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

  // ── Churn aggregate — GET /v1/churn (bearer-gated; churn reporting for admin) ──
  if (url.pathname === "/v1/churn") {
    if (request.method !== "GET")
      return json({ error: "method_not_allowed" }, 405, cors);
    const denied =
      requireAdminBearer(request, env, cors) ??
      (await rateLimit(request, env, cors));
    if (denied) return denied;
    if (!env.MAIN_DB) return json({ error: "unavailable" }, 503, cors);
    return json(await readChurnAggregate(env.MAIN_DB), 200, cors);
  }

  // ── Settings — GET (view) / PUT (edit) /v1/settings (bearer-gated; workers read these) ──
  if (url.pathname === "/v1/settings") {
    if (request.method === "OPTIONS")
      return new Response(null, { status: 204, headers: cors });
    const denied =
      requireAdminBearer(request, env, cors) ??
      (await rateLimit(request, env, cors));
    if (denied) return denied;
    if (!env.MAIN_DB || !env.AUDIT_DB)
      return json({ error: "unavailable" }, 503, cors);

    if (request.method === "GET") {
      const { results } = await env.MAIN_DB.prepare(
        "SELECT key, value, updated_at, updated_by FROM site_settings",
      ).all<{
        key: string;
        value: string;
        updated_at: string;
        updated_by: string;
      }>();
      const overrides = new Map(results.map((r) => [r.key, r]));
      const effective = effectiveSettings(results);
      const settings = (Object.keys(SETTINGS) as SettingKey[]).map((key) => {
        const o = overrides.get(key);
        return {
          key,
          value: effective[key],
          def: SETTINGS[key].def,
          min: SETTINGS[key].min,
          max: SETTINGS[key].max,
          unit: SETTINGS[key].unit,
          updatedAt: o?.updated_at ?? null,
          updatedBy: o?.updated_by ?? null,
        };
      });
      return json({ settings }, 200, cors);
    }

    if (request.method === "PUT") {
      let body: { key?: unknown; value?: unknown; actor?: unknown };
      try {
        const text = await request.text();
        if (new TextEncoder().encode(text).length > BODY_MAX)
          return json({ error: "too_large" }, 413, cors);
        body = JSON.parse(text) as typeof body;
      } catch {
        return json({ error: "invalid" }, 400, cors);
      }
      const key = typeof body.key === "string" ? body.key : "";
      const actor =
        typeof body.actor === "string" ? body.actor.slice(0, 128) : "";
      const raw = typeof body.value === "number" ? String(body.value) : "";
      if (!key || !actor || raw === "")
        return json({ error: "invalid" }, 400, cors);
      const rule = (SETTINGS as Record<string, { min: number; max: number }>)[
        key
      ];
      const coerced = coerceSetting(key, raw);
      // Reject rather than silently clamp — the operator sees the bound.
      if (!rule || coerced === null || coerced !== Number(raw))
        return json(
          { error: "out_of_range", min: rule?.min, max: rule?.max },
          422,
          cors,
        );

      const ts = new Date().toISOString();
      // site_settings (MAIN_DB) and admin_audit (DB) are now separate D1 instances, so
      // this can no longer be one atomic batch. The setting write is primary — it must
      // surface a failure; the audit write is secondary and non-fatal if it throws
      // (mirrors export/route.ts's admin_audit write after the primary MAIN_DB write).
      await env.MAIN_DB.prepare(
        "INSERT INTO site_settings (key, value, updated_at, updated_by) VALUES (?, ?, ?, ?) " +
          "ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at, updated_by = excluded.updated_by",
      )
        .bind(key, raw, ts, actor)
        .run();
      try {
        await env.AUDIT_DB.prepare(
          "INSERT INTO admin_audit (ts, event, actor_user_id, target_user_id, country, ip_hash) VALUES (?, 'setting_changed', ?, ?, ?, NULL)",
        )
          .bind(ts, actor, key, request.headers.get("cf-ipcountry"))
          .run();
      } catch (error) {
        logger.error("setting_changed audit write failed", {
          name: (error as Error)?.name,
        });
      }
      return json({ ok: true }, 200, cors);
    }

    return json({ error: "method_not_allowed" }, 405, cors);
  }

  // ── Backups status — GET /v1/backups/status (bearer-gated; read-only history for
  // the admin card) ── bucket/retention/pre-migration-flag come from env/config; recent
  // rows come from `backup_runs` (migration 0003, audit DB), written by the backup scripts.
  if (url.pathname === "/v1/backups/status") {
    if (request.method === "OPTIONS")
      return new Response(null, { status: 204, headers: cors });
    if (request.method !== "GET")
      return json({ error: "method_not_allowed" }, 405, cors);
    const denied =
      requireAdminBearer(request, env, cors) ??
      (await rateLimit(request, env, cors));
    if (denied) return denied;

    let runs: Array<Record<string, unknown>> = [];
    if (env.AUDIT_DB) {
      const { results } = await env.AUDIT_DB.prepare(
        "SELECT db_name, env, kind, status, bytes, error, started_at, finished_at FROM backup_runs ORDER BY started_at DESC LIMIT 20",
      ).all<{
        db_name: string;
        env: string;
        kind: string;
        status: string;
        bytes: number | null;
        error: string | null;
        started_at: string;
        finished_at: string | null;
      }>();
      runs = results.map((r) => ({
        dbName: r.db_name,
        env: r.env,
        kind: r.kind,
        status: r.status,
        bytes: r.bytes,
        error: r.error,
        startedAt: r.started_at,
        finishedAt: r.finished_at,
      }));
    }
    return json(
      {
        bucket: env.BACKUP_BUCKET ?? null,
        retentionDays: Number(env.BACKUP_RETENTION_DAYS ?? 30),
        preMigrationSnapshots: true,
        runs,
      },
      200,
      cors,
    );
  }

  // ── Monitoring — GET /v1/cron/status + GET /v1/erasure-requests (bearer-gated,
  // read-only; the admin "Scheduled jobs" + "Erasure requests" pages). Payloads + the
  // "open request" definition: ./monitoring.ts.
  if (
    url.pathname === "/v1/cron/status" ||
    url.pathname === "/v1/erasure-requests"
  ) {
    if (request.method === "OPTIONS")
      return new Response(null, { status: 204, headers: cors });
    if (request.method !== "GET")
      return json({ error: "method_not_allowed" }, 405, cors);
    const denied =
      requireAdminBearer(request, env, cors) ??
      (await rateLimit(request, env, cors));
    if (denied) return denied;
    const warnDays = (await readSettings(env.MAIN_DB, monitoringSettings))[
      "ops.sla_warning_days"
    ];
    const body =
      url.pathname === "/v1/cron/status"
        ? await cronStatus(env, Date.now(), warnDays)
        : await erasureRequests(env, Date.now(), warnDays);
    return json(body, 200, cors);
  }

  // ── Run the cron now — POST /v1/cron/run (bearer-gated; admin "Run now"). Reaches the
  // cron's POST /run over the private CRON service binding. ./monitoring.ts.
  if (url.pathname === "/v1/cron/run") {
    if (request.method === "OPTIONS")
      return new Response(null, { status: 204, headers: cors });
    if (request.method !== "POST")
      return json({ error: "method_not_allowed" }, 405, cors);
    const denied =
      requireAdminBearer(request, env, cors) ??
      (await rateLimit(request, env, cors));
    if (denied) return denied;
    const { status, body } = await forwardCronRun(env);
    return json(body, status, cors);
  }

  // ── Admin actions on an erasure request — POST /v1/erasure-requests/:id/retry|close
  // (bearer-gated; the admin server action re-checks the role + audits). ./erasure/admin.ts.
  const erasureAction = url.pathname.match(
    /^\/v1\/erasure-requests\/(\d+)\/(retry|close)$/,
  );
  if (erasureAction) {
    if (request.method === "OPTIONS")
      return new Response(null, { status: 204, headers: cors });
    if (request.method !== "POST")
      return json({ error: "method_not_allowed" }, 405, cors);
    const denied =
      requireAdminBearer(request, env, cors) ??
      (await rateLimit(request, env, cors));
    if (denied) return denied;
    const id = Number(erasureAction[1]);
    return erasureAction[2] === "retry"
      ? handleErasureRetry(request, env, id)
      : handleErasureClose(request, env, id);
  }

  // ── DSAR intake — POST /v1/data-request (bearer-gated write; the website's
  // /api/data-request route proxies here) + GET /v1/data-requests (bearer-gated read;
  // the admin screen) ── Logic lives in data-request/route.ts — this stays a thin dispatch.
  if (url.pathname === "/v1/data-request")
    return handleDataRequestWrite(request, env);
  if (url.pathname === "/v1/data-requests")
    return handleDataRequestList(request, env);
  // GET /v1/data-requests/:id (detail + history) · POST …/:id/status (operator moves).
  const dr = url.pathname.match(/^\/v1\/data-requests\/(\d+)(\/status)?$/);
  if (dr)
    return dr[2]
      ? handleDataRequestStatus(request, env, Number(dr[1]))
      : handleDataRequestDetail(request, env, Number(dr[1]));

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
    if (Number(request.headers.get("content-length") ?? 0) > WEBHOOK_BODY_MAX)
      return json({ error: "too_large" }, 413, cors);
    const svixId = request.headers.get("svix-id");
    const svixTs = request.headers.get("svix-timestamp");
    const svixSig = request.headers.get("svix-signature");
    const raw = await request.text();
    if (new TextEncoder().encode(raw).length > WEBHOOK_BODY_MAX)
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
    const role = (data.public_metadata as { role?: string } | undefined)?.role;
    if (evt.type === "user.updated" && role === "admin" && env.AUDIT_DB) {
      const privEscTs = new Date().toISOString();
      const privEscUserId = typeof data.id === "string" ? data.id : null;
      const privEscCountry = request.headers.get("cf-ipcountry") ?? null;
      const privEscDesc = "role→admin via Clerk (out-of-band)";
      try {
        await env.AUDIT_DB.prepare(
          "INSERT INTO security_events (ts, event_type, severity, surface, user_id, country, ip_hash, description) VALUES (?, ?, ?, ?, ?, ?, NULL, ?)",
        )
          .bind(
            privEscTs,
            "privilege_escalation",
            "high",
            "api",
            privEscUserId,
            privEscCountry,
            privEscDesc,
          )
          .run();
        // Always alerts — privilege_escalation is always "high", and shouldAlert("high")
        // is always true. Fired via waitUntil so it never delays the response.
        ctx.waitUntil(
          sendSecurityAlertEmail(env, {
            eventType: "privilege_escalation",
            severity: "high",
            surface: "api",
            userId: privEscUserId,
            country: privEscCountry,
            description: privEscDesc,
            ts: privEscTs,
          }),
        );
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
      env.MAIN_DB &&
      (evt.type === "user.created" ||
        evt.type === "user.updated" ||
        evt.type === "user.deleted")
    ) {
      const userId = typeof data.id === "string" ? data.id : null;
      if (userId) {
        const now = new Date().toISOString();
        try {
          if (evt.type === "user.deleted") {
            await handleClerkUserDeleted(env, userId, now);
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
            // The visitor's sign-up locale, from Clerk UNSAFE (client-set) metadata —
            // validate strictly against the known locales before storing; it drives the
            // localized auth emails, so an arbitrary value must never reach the DB.
            const unsafe = data.unsafe_metadata as
              | {
                  locale?: unknown;
                  marketing_email?: unknown;
                  consent_surface?: unknown;
                }
              | undefined;
            const rawLocale = unsafe?.locale;
            const locale =
              typeof rawLocale === "string" && isLocale(rawLocale, localeCodes)
                ? rawLocale
                : null;
            // Marketing-email opt-in from Clerk UNSAFE (client-set) metadata. Only a real
            // boolean counts; anything else is "no decision" (null). Set on the INSERT and
            // deliberately OMITTED from the ON CONFLICT set clause — the sign-up value is
            // stale after a settings change, so a later user.updated must never re-apply it
            // (locale has no other writer, so it keeps its COALESCE).
            const rawMkt = unsafe?.marketing_email;
            const marketingEmail =
              typeof rawMkt === "boolean" ? (rawMkt ? 1 : 0) : null;
            const consentSurface =
              typeof unsafe?.consent_surface === "string" &&
              unsafe.consent_surface
                ? unsafe.consent_surface.slice(0, 16)
                : "signup";
            // COALESCE guards email + email_fingerprint: a degenerate payload with no
            // resolvable email must not clear the stored ones. The fingerprint is the
            // erasure key, so losing it breaks email-keyed erasure. A real incoming
            // email still overwrites, via excluded. full_name has no such guard —
            // a name clear/update should propagate; it is not the erasure key.
            await env.MAIN_DB.prepare(
              "INSERT INTO user_profiles (user_id, email, full_name, email_fingerprint, locale, marketing_email, created_at, last_login_at) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, NULL) " +
                "ON CONFLICT(user_id) DO UPDATE SET email = COALESCE(excluded.email, email), full_name = excluded.full_name, email_fingerprint = COALESCE(excluded.email_fingerprint, email_fingerprint), locale = COALESCE(excluded.locale, locale)",
            )
              .bind(
                userId,
                email,
                fullName,
                fingerprint,
                locale,
                marketingEmail,
                now,
              )
              .run();
            // Post-signup welcome email — best-effort, only on create, in the sign-up
            // locale. `waitUntil` + the sender's own never-throw contract keep it from
            // ever blocking or failing the webhook's profile sync.
            if (evt.type === "user.created" && email) {
              ctx.waitUntil(
                sendWelcomeEmail(env, {
                  to: email,
                  locale: locale ?? defaultLocale,
                }),
              );
            }

            // Sign-up marketing decision → append the consent proof (append-only; keyed by
            // fingerprint, never raw email) and mirror to the Resend audience (best-effort,
            // via waitUntil so a Resend hiccup never fails the webhook). Only on create —
            // the settings toggle owns every later change.
            if (evt.type === "user.created" && marketingEmail !== null) {
              await env.MAIN_DB.prepare(
                "INSERT OR IGNORE INTO consent_events (ts, subject_type, subject_id, email_fingerprint, consent_type, granted, policy_version, surface, source, country, ip_hash, idempotency_key) " +
                  "VALUES (?, 'user', ?, ?, 'marketing_email', ?, '1', ?, 'signup', NULL, NULL, ?)",
              )
                .bind(
                  now,
                  userId,
                  fingerprint,
                  marketingEmail,
                  consentSurface,
                  `signup:${userId}:marketing_email`,
                )
                .run();
              if (email) {
                const contactEmail = email;
                ctx.waitUntil(
                  (async () => {
                    try {
                      await upsertResendContact(env, {
                        email: contactEmail,
                        granted: marketingEmail === 1,
                      });
                    } catch (error) {
                      logger.error("resend signup sync failed", {
                        name: (error as Error)?.name,
                      });
                    }
                  })(),
                );
              }

              // Sign-up opt-in → grant the Studio's `includeAtSignup` categories
              // (per-category email_preferences + proof), so a new opted-in user starts
              // subscribed. Best-effort: never fails the webhook — the marketing_email
              // column write above is the primary path. Only on create, matching the
              // "mirror on insert only" semantics above.
              if (marketingEmail === 1) {
                try {
                  const { categories } = await fetchEmailPreferences(
                    env,
                    locale ?? defaultLocale,
                  );
                  const includeAtSignupKeys = categories
                    .filter((c) => c.includeAtSignup)
                    .map((c) => c.key);
                  const grantKeys =
                    includeAtSignupKeys.length > 0
                      ? includeAtSignupKeys
                      : ["news"];
                  // Superset of the Studio categories + whatever we actually grant, so a
                  // "news" fallback (not itself a Studio category) still recomputes
                  // marketing_email consistently.
                  const marketingKeys = Array.from(
                    new Set([...categories.map((c) => c.key), ...grantKeys]),
                  );
                  await writePreferences(env.MAIN_DB, {
                    userId,
                    fingerprint,
                    updates: grantKeys.map((key) => ({
                      key,
                      granted: true,
                    })),
                    surface: "signup",
                    country: request.headers.get("cf-ipcountry") ?? null,
                    marketingKeys,
                  });
                } catch (error) {
                  logger.error("email preferences signup grant failed", {
                    name: (error as Error)?.name,
                  });
                }
              }
            }
          }
        } catch (error) {
          logger.error("clerk profile sync failed", {
            name: (error as Error)?.name,
          });
          return json({ error: "server" }, 502, cors);
        }
      }
    }
    // ── email.created — Clerk email take-over (localized auth emails via Resend) ──
    // Fires only when the operator toggled "Delivered by Clerk" off for a template.
    // Localize + send; a failure throws → 502 so Clerk retries (a verification code
    // must not be silently lost). No-op (200) only when the event has no recipient.
    if (evt.type === "email.created") {
      try {
        await handleClerkEmail(env, data);
      } catch (error) {
        // `message` is "resend <status>" or "mailer unconfigured" — no PII, and it names
        // the cause (a 403 is a sender domain not verified in Resend).
        logger.error("clerk email delivery failed", {
          name: (error as Error)?.name,
          message: (error as Error)?.message,
        });
        return json({ error: "email" }, 502, cors);
      }
    }
    return json({ ok: true }, 200, cors);
  }

  // ── Announcements — GET /v1/announcements (PUBLIC; banner + toast per surface) ──
  // Serves the same Sanity content the website reads server-side, to the client-gated
  // app surface. No bearer: it is public marketing content.
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
    const locale = (url.searchParams.get("locale") || defaultLocale) as Locale;

    if (!env.SANITY_PROJECT_ID || !env.SANITY_DATASET)
      return json({ error: "unavailable" }, 503, PUBLIC_CORS);

    // Rate-limit the public read before the outbound Sanity fetch (cache-bypassing
    // query strings could otherwise amplify into Sanity). Defence-in-depth behind the WAF.
    if (env.RATELIMIT) {
      const { success } = await env.RATELIMIT.limit({
        key: clientIp(request),
      });
      if (!success) return json({ error: "rate_limited" }, 429, PUBLIC_CORS);
    }

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

  // ── GDPR erasure request — GET/POST /v1/erasure/request (PUBLIC; Turnstile + rate-limit) ──
  // GET renders the request form; POST files the request. Anti-enumeration + the
  // request-form HTML live in erasure/request.ts — this stays a thin dispatch.
  if (url.pathname === "/v1/erasure/request")
    return handleErasureRequest(request, env, ctx);

  // ── GDPR erasure confirm — GET/POST /v1/erasure/confirm (PUBLIC; token + typed
  // email + TTL + attempt cap) ── GET renders the confirm form (no mutation); POST
  // verifies and runs the live erasure engine. Verification + engine assembly live
  // in erasure/confirm.ts — this stays a thin dispatch.
  if (url.pathname === "/v1/erasure/confirm")
    return handleErasureConfirm(request, env, ctx);

  // ── GDPR self-service erasure — POST /v1/erasure/self (AUTHENTICATED; Clerk JWT +
  // typed-email gate) ── A signed-in user erases their own data with no email
  // round-trip. Verification + engine assembly live in erasure/self.ts.
  if (url.pathname === "/v1/erasure/self")
    return handleErasureSelf(request, env, ctx);

  // ── GDPR erasure status — GET /v1/erasure/status/:token (PUBLIC; no PII) ──
  // The subject polls their request state by the plaintext token from their email.
  if (url.pathname.startsWith("/v1/erasure/status/")) {
    const token = url.pathname.slice("/v1/erasure/status/".length);
    return handleErasureStatus(request, env, token);
  }

  // ── Marketing-email consent — GET/POST /v1/consent/marketing-email (AUTHENTICATED;
  // Clerk JWT). The account toggle + the sign-in nudge read/write the caller's own opt-in.
  if (url.pathname === "/v1/consent/marketing-email")
    return handleMarketingConsent(request, env, ctx);

  // ── Legal re-acceptance — GET/POST /v1/consent/legal (AUTHENTICATED; Clerk JWT). Makes
  // the "policies updated" banner follow a signed-in user across website · app (and the Capacitor shell):
  // accept on one, cleared on all. Anonymous visitors keep their per-surface local deposit.
  if (url.pathname === "/v1/consent/legal")
    return handleLegalConsent(request, env, ctx);

  // ── Per-category email preferences — GET/POST /v1/consent/email-preferences
  // (AUTHENTICATED; Clerk JWT). The account preference centre reads/writes the
  // caller's own per-category choices (Studio-defined categories, Task 6's reader).
  if (url.pathname === "/v1/consent/email-preferences")
    return handleEmailPreferences(request, env, ctx);

  // ── No-login email preferences — GET/POST /v1/email-preferences (PUBLIC; a signed
  // pref-token from an email link stands in for the Clerk JWT above) + POST
  // /v1/email-preferences/unsubscribe (PUBLIC; RFC 8058 one-click unsubscribe target). ──
  if (url.pathname === "/v1/email-preferences")
    return handleTokenPreferences(request, env, ctx);
  if (url.pathname === "/v1/email-preferences/unsubscribe")
    return handleOneClickUnsubscribe(request, env, ctx);

  // ── GDPR data export — POST /v1/export (AUTHENTICATED; Clerk JWT) ── Runs
  // runExport, stores the bundle in R2, and returns a single-use expiring download
  // link. GET /v1/export/download?token=… (PUBLIC; the token itself is the auth)
  // streams the bundle and deletes it on first download.
  if (url.pathname === "/v1/export") return handleExport(request, env, ctx);
  if (url.pathname.startsWith("/v1/export/download")) {
    const token = new URL(request.url).searchParams.get("token") ?? "";
    return handleExportDownload(request, env, token);
  }

  logger.info("api request", {
    method: request.method,
    pathname: url.pathname,
  });
  return new Response("Not found", { status: 404 });
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    const requestId = requestIdOf(request);
    let res: Response;
    try {
      res = await withIdempotency(request, env, (req) => route(req, env, ctx));
    } catch (error) {
      res = errorFromThrow(error, requestId);
    }
    return finalize(res, requestId);
  },
} satisfies ExportedHandler<Env>;

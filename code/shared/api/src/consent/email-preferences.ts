/**
 * Handle the authenticated and no-login email-preference routes plus RFC 8058 one-click unsubscribe.
 *
 * @see docs/reference/shared/api/src/consent/email-preferences.md
 */
// Per-category email preferences. Two ways in:
//   AUTHENTICATED (Clerk JWT) — the account preference centre + mobile, reading/writing the
//     caller's own choices.
//   NO-LOGIN (a signed pref-token from an email link, Task 7) — the preference centre AND
//     RFC 8058 one-click unsubscribe reachable straight from an email, no session needed.
// Both share the same read-state / apply-updates internals (categories merge, D1 store,
// best-effort Resend Topics mirror) — only how the caller's user id is established differs.
// Mirrors consent/marketing.ts's structure (CORS, verify, 503 guard); distinct from
// `/v1/consent/marketing-email`, which is the legacy single-flag route.
//
//   GET  /v1/consent/email-preferences → { categories: [{key,name,description,includeAtSignup,granted}], notices, marketing_email }
//   POST /v1/consent/email-preferences  { updates: [{key, granted}], surface? } → { ok: true }
//   GET  /v1/email-preferences?token=…  → same shape as above, no login
//   POST /v1/email-preferences          { token, updates: [{key, granted}], surface? } → { ok: true }
//   POST /v1/email-preferences/unsubscribe?token=…  → { ok: true } (RFC 8058 one-click target)
//
// A write appends the append-only proof + per-category state (Task 5's store) and best-effort
// mirrors the changed categories to Resend Topics (Task 8).
import { logger } from "@indiecrafts/packages-shared-logger";
import { type Env, PUBLIC_CORS_POST, clientIp } from "../index";
import { readProfileLocale } from "../erasure/email";
import { verifyUserId } from "./marketing";
import { readPreferences, writePreferences } from "./email-preferences-store";
import {
  fetchEmailPreferences,
  type PrefCategory,
  type PrefNotice,
} from "./email-preferences-sanity";
import { syncContactTopics } from "../resend-audience";
import { signPrefToken, verifyPrefToken } from "./pref-token";

const BODY_MAX = 4000;

// Same reasoning as consent/marketing.ts: called client→api with Authorization: Bearer <jwt>,
// so it must allow the `authorization` header. `*` origin is safe — never credentialed.
const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, OPTIONS",
  "access-control-allow-headers": "authorization, content-type",
};

function json(
  body: unknown,
  status: number,
  cors: Record<string, string> = CORS,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...cors },
  });
}

export type EmailPreferencesDeps = {
  authenticate?: (request: Request, env: Env) => Promise<string | null>;
  fetchCategories?: (
    env: Env,
    locale: string,
  ) => Promise<{ categories: PrefCategory[]; notices: PrefNotice[] }>;
  sync?: typeof syncContactTopics;
};

/** Parse + validate a POST body's `updates` field. `null` → the caller should 400. */
function parseUpdates(
  raw: unknown,
): { key: string; granted: boolean }[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const updates: { key: string; granted: boolean }[] = [];
  for (const u of raw as { key?: unknown; granted?: unknown }[]) {
    if (typeof u?.key !== "string" || typeof u?.granted !== "boolean")
      return null;
    updates.push({ key: u.key, granted: u.granted });
  }
  return updates;
}

/** The GET response body: Studio categories merged with the user's stored `granted` state. */
async function readState(opts: {
  env: Env;
  db: D1Database;
  fetchCategories: NonNullable<EmailPreferencesDeps["fetchCategories"]>;
  userId: string;
  locale: string;
}): Promise<{
  categories: Array<{
    key: string;
    name: string;
    description: string;
    includeAtSignup: boolean;
    granted: boolean;
  }>;
  notices: PrefNotice[];
  marketing_email: boolean | null;
}> {
  const { env, db, fetchCategories, userId, locale } = opts;
  const { categories, notices } = await fetchCategories(env, locale);
  const stored = await readPreferences(db, userId);
  const row = await db
    .prepare("SELECT marketing_email FROM user_profiles WHERE user_id = ?")
    .bind(userId)
    .first<{ marketing_email: number | null }>();
  const marketingEmail = row?.marketing_email;
  return {
    categories: categories.map((c) => ({
      key: c.key,
      name: c.name,
      description: c.description,
      includeAtSignup: c.includeAtSignup,
      granted: stored[c.key] ?? false,
    })),
    notices,
    marketing_email: marketingEmail == null ? null : marketingEmail === 1,
  };
}

/** Validate `updates` against the current category set, write them (proof + derived cache),
 *  and best-effort mirror the changed categories to Resend Topics. */
async function applyUpdates(opts: {
  env: Env;
  db: D1Database;
  fetchCategories: NonNullable<EmailPreferencesDeps["fetchCategories"]>;
  sync: NonNullable<EmailPreferencesDeps["sync"]>;
  ctx?: ExecutionContext;
  userId: string;
  locale: string;
  updates: { key: string; granted: boolean }[];
  surface: string;
  country: string | null;
}): Promise<{ ok: true } | { error: "invalid_category" }> {
  const {
    env,
    db,
    fetchCategories,
    sync,
    ctx,
    userId,
    locale,
    updates,
    surface,
    country,
  } = opts;

  const { categories } = await fetchCategories(env, locale);
  const categoryByKey = new Map(categories.map((c) => [c.key, c]));
  for (const u of updates)
    if (!categoryByKey.has(u.key)) return { error: "invalid_category" };
  const marketingKeys = categories.map((c) => c.key);

  const prof = await db
    .prepare(
      "SELECT email, email_fingerprint FROM user_profiles WHERE user_id = ?",
    )
    .bind(userId)
    .first<{ email: string | null; email_fingerprint: string | null }>();

  await writePreferences(db, {
    userId,
    fingerprint: prof?.email_fingerprint ?? null,
    updates,
    surface,
    country,
    marketingKeys,
  });

  // Best-effort Resend Topics mirror — never fails the write (the D1 rows are the source of
  // truth). Only the changed categories' topics, matching the write payload.
  const email = prof?.email;
  if (email) {
    const topics = updates
      .map((u) => ({
        topicId: categoryByKey.get(u.key)?.resendTopicId,
        granted: u.granted,
      }))
      .filter((t): t is { topicId: string; granted: boolean } =>
        Boolean(t.topicId),
      );
    const run = (async () => {
      try {
        await sync(env, { email, topics });
      } catch (error) {
        logger.error("resend topics sync failed", {
          name: (error as Error)?.name,
        });
      }
    })();
    if (ctx) ctx.waitUntil(run);
    else await run;
  }

  return { ok: true };
}

export async function handleEmailPreferences(
  request: Request,
  env: Env,
  ctx?: ExecutionContext,
  deps: EmailPreferencesDeps = {},
): Promise<Response> {
  const authenticate = deps.authenticate ?? verifyUserId;
  const fetchCategories = deps.fetchCategories ?? fetchEmailPreferences;
  const sync = deps.sync ?? syncContactTopics;

  if (request.method === "OPTIONS")
    return new Response(null, { status: 204, headers: CORS });
  if (request.method !== "GET" && request.method !== "POST")
    return json({ error: "method_not_allowed" }, 405);
  if (!env.MAIN_DB || !env.CLERK_SECRET_KEY)
    return json({ error: "unavailable" }, 503);

  if (env.AGENT_RATELIMIT) {
    const { success } = await env.AGENT_RATELIMIT.limit({
      key: clientIp(request),
    });
    if (!success) return json({ error: "rate_limited" }, 429);
  }

  const userId = await authenticate(request, env);
  if (!userId) return json({ error: "unauthorized" }, 401);

  const locale = await readProfileLocale(env.MAIN_DB, { userId });

  if (request.method === "GET") {
    const state = await readState({
      env,
      db: env.MAIN_DB,
      fetchCategories,
      userId,
      locale,
    });
    return json(state, 200);
  }

  // POST — write updates.
  if (Number(request.headers.get("content-length") ?? 0) > BODY_MAX)
    return json({ error: "too_large" }, 413);
  let body: { updates?: unknown; surface?: unknown };
  try {
    const text = await request.text();
    if (new TextEncoder().encode(text).length > BODY_MAX)
      return json({ error: "too_large" }, 413);
    body = JSON.parse(text) as typeof body;
  } catch {
    return json({ error: "invalid" }, 400);
  }
  const updates = parseUpdates(body.updates);
  if (!updates) return json({ error: "invalid" }, 400);

  const surface =
    (typeof body.surface === "string" ? body.surface : "").slice(0, 16) ||
    "account";
  const country = request.headers.get("cf-ipcountry") ?? null;

  const result = await applyUpdates({
    env,
    db: env.MAIN_DB,
    fetchCategories,
    sync,
    ctx,
    userId,
    locale,
    updates,
    surface,
    country,
  });
  if ("error" in result) return json(result, 400);
  return json(result, 200);
}

/**
 * No-login preference centre — GET/POST /v1/email-preferences. Same read/write internals as
 * `handleEmailPreferences`, but the user id comes from a signed pref-token (Task 7) instead
 * of a Clerk JWT, so an email link can open the preference centre with no session. PUBLIC:
 * rate-limited + fail-closed on a bad/absent/missing-secret token, mirroring erasure/request.ts.
 */
export async function handleTokenPreferences(
  request: Request,
  env: Env,
  ctx?: ExecutionContext,
  deps: EmailPreferencesDeps = {},
): Promise<Response> {
  const fetchCategories = deps.fetchCategories ?? fetchEmailPreferences;
  const sync = deps.sync ?? syncContactTopics;

  if (request.method === "OPTIONS")
    return new Response(null, { status: 204, headers: PUBLIC_CORS_POST });
  if (request.method !== "GET" && request.method !== "POST")
    return json({ error: "method_not_allowed" }, 405, PUBLIC_CORS_POST);
  if (!env.MAIN_DB || !env.EMAIL_PREF_SECRET)
    return json({ error: "unavailable" }, 503, PUBLIC_CORS_POST);

  if (env.AGENT_RATELIMIT) {
    const { success } = await env.AGENT_RATELIMIT.limit({
      key: clientIp(request),
    });
    if (!success) return json({ error: "rate_limited" }, 429, PUBLIC_CORS_POST);
  }

  const url = new URL(request.url);
  let token = url.searchParams.get("token") ?? "";
  let body: { updates?: unknown; surface?: unknown } = {};
  if (request.method === "POST") {
    if (Number(request.headers.get("content-length") ?? 0) > BODY_MAX)
      return json({ error: "too_large" }, 413, PUBLIC_CORS_POST);
    let parsed: { token?: unknown; updates?: unknown; surface?: unknown };
    try {
      parsed = (await request.json()) as typeof parsed;
    } catch {
      return json({ error: "invalid" }, 400, PUBLIC_CORS_POST);
    }
    if (typeof parsed.token === "string" && parsed.token) token = parsed.token;
    body = parsed;
  }

  const payload = token
    ? await verifyPrefToken(env.EMAIL_PREF_SECRET, token)
    : null;
  if (!payload) return json({ error: "unauthorized" }, 401, PUBLIC_CORS_POST);
  const userId = payload.uid;

  const locale = await readProfileLocale(env.MAIN_DB, { userId });

  if (request.method === "GET") {
    const state = await readState({
      env,
      db: env.MAIN_DB,
      fetchCategories,
      userId,
      locale,
    });
    return json(state, 200, PUBLIC_CORS_POST);
  }

  const updates = parseUpdates(body.updates);
  if (!updates) return json({ error: "invalid" }, 400, PUBLIC_CORS_POST);
  const surface =
    (typeof body.surface === "string" ? body.surface : "").slice(0, 16) ||
    "email_link";
  const country = request.headers.get("cf-ipcountry") ?? null;

  const result = await applyUpdates({
    env,
    db: env.MAIN_DB,
    fetchCategories,
    sync,
    ctx,
    userId,
    locale,
    updates,
    surface,
    country,
  });
  if ("error" in result) return json(result, 400, PUBLIC_CORS_POST);
  return json(result, 200, PUBLIC_CORS_POST);
}

/**
 * RFC 8058 one-click unsubscribe — POST /v1/email-preferences/unsubscribe?token=…, the
 * `List-Unsubscribe-Post` target. Mail clients POST `List-Unsubscribe=One-Click` form data
 * with no token in the body (it's already in the URL); a JSON `{token}` body works too (e.g.
 * a "manage preferences" page's own unsubscribe button). The token's `cat` (if the link was
 * scoped to one category) or every marketing category is set to `granted:false`. Always
 * 200s on a valid token — idempotent, no partial states to report back.
 */
export async function handleOneClickUnsubscribe(
  request: Request,
  env: Env,
  ctx?: ExecutionContext,
  deps: EmailPreferencesDeps = {},
): Promise<Response> {
  const fetchCategories = deps.fetchCategories ?? fetchEmailPreferences;
  const sync = deps.sync ?? syncContactTopics;

  if (request.method === "OPTIONS")
    return new Response(null, { status: 204, headers: PUBLIC_CORS_POST });
  if (request.method !== "POST")
    return json({ error: "method_not_allowed" }, 405, PUBLIC_CORS_POST);
  if (!env.MAIN_DB || !env.EMAIL_PREF_SECRET)
    return json({ error: "unavailable" }, 503, PUBLIC_CORS_POST);

  if (env.AGENT_RATELIMIT) {
    const { success } = await env.AGENT_RATELIMIT.limit({
      key: clientIp(request),
    });
    if (!success) return json({ error: "rate_limited" }, 429, PUBLIC_CORS_POST);
  }

  const url = new URL(request.url);
  let token = url.searchParams.get("token") ?? "";
  if (!token) {
    if (Number(request.headers.get("content-length") ?? 0) > BODY_MAX)
      return json({ error: "too_large" }, 413, PUBLIC_CORS_POST);
    try {
      const contentType = request.headers.get("content-type") ?? "";
      if (contentType.includes("application/json")) {
        const parsed = (await request.json()) as { token?: unknown };
        if (typeof parsed.token === "string") token = parsed.token;
      } else {
        const form = await request.formData();
        const t = form.get("token");
        if (typeof t === "string") token = t;
      }
    } catch {
      // Malformed/absent body — token stays empty, falls through to 401 below.
    }
  }

  const payload = token
    ? await verifyPrefToken(env.EMAIL_PREF_SECRET, token)
    : null;
  if (!payload) return json({ error: "unauthorized" }, 401, PUBLIC_CORS_POST);
  const userId = payload.uid;

  const locale = await readProfileLocale(env.MAIN_DB, { userId });
  const { categories } = await fetchCategories(env, locale);
  const updates = payload.cat
    ? [{ key: payload.cat, granted: false }]
    : categories.map((c) => ({ key: c.key, granted: false }));

  if (updates.length > 0) {
    const country = request.headers.get("cf-ipcountry") ?? null;
    // A stale token `cat` (a Studio category renamed/removed after the email went out) fails
    // category validation inside applyUpdates — RFC 8058 still requires success semantics, so
    // that never surfaces as an error response; there's just nothing left to turn off.
    await applyUpdates({
      env,
      db: env.MAIN_DB,
      fetchCategories,
      sync,
      ctx,
      userId,
      locale,
      updates,
      surface: "unsubscribe",
      country,
    });
  }

  return json({ ok: true }, 200, PUBLIC_CORS_POST);
}

/**
 * Build the no-login preference-centre + one-click-unsubscribe links for a user — for a
 * future task's outbound-email sender to embed as the `List-Unsubscribe`/
 * `List-Unsubscribe-Post` headers (and a "manage preferences" body link). `cat` scopes the
 * unsubscribe token to one category (e.g. the topic the email itself belongs to); omitted →
 * unsubscribes from every marketing category.
 */
export async function emailPreferenceLinks(
  env: Env,
  uid: string,
  cat?: string,
): Promise<{
  manageUrl: string;
  unsubscribeUrl: string;
  headers: {
    "List-Unsubscribe": string;
    "List-Unsubscribe-Post": "List-Unsubscribe=One-Click";
  };
}> {
  if (!env.EMAIL_PREF_SECRET)
    throw new Error("EMAIL_PREF_SECRET not configured");
  const token = await signPrefToken(env.EMAIL_PREF_SECRET, uid, cat);
  // WEBSITE_URL is this deployment's one public origin — the api's /v1/* routes are reachable
  // on the same domain (Cloudflare route-based path multiplexing), so it doubles as the api
  // origin. ponytail: no per-request Request is available here to fall back on (unlike
  // erasure/request.ts); add a dedicated api-origin var if the api ever needs its own domain.
  const origin = env.WEBSITE_URL ?? "";
  const unsubscribeUrl = `${origin}/v1/email-preferences/unsubscribe?token=${token}`;
  return {
    manageUrl: `${origin}/email-preferences?token=${token}`,
    unsubscribeUrl,
    headers: {
      "List-Unsubscribe": `<${unsubscribeUrl}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
  };
}

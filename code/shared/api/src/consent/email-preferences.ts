// Per-category email preferences — the AUTHENTICATED read/write path. A signed-in user
// reads the category set (Studio-defined, via Task 6's Sanity reader) merged with their own
// stored choices, and writes updates to them. The account preference centre AND mobile both
// call this. Mirrors consent/marketing.ts's structure (CORS, JWT verify, 503 guard); distinct
// from `/v1/consent/marketing-email`, which is the legacy single-flag route.
//
//   GET  /v1/consent/email-preferences → { categories: [{key,name,description,includeAtSignup,granted}], notices, marketing_email }
//   POST /v1/consent/email-preferences  { updates: [{key, granted}], surface? } → { ok: true }
//
// A POST writes the append-only proof + per-category state (Task 5's store) and best-effort
// mirrors the changed categories to Resend Topics (Task 8).
import { logger } from "@indiecrafts/packages-shared-logger";
import { type Env } from "../index";
import { readProfileLocale } from "../erasure/email";
import { verifyUserId } from "./marketing";
import { readPreferences, writePreferences } from "./email-preferences-store";
import {
  fetchEmailPreferences,
  type PrefCategory,
  type PrefNotice,
} from "./email-preferences-sanity";
import { syncContactTopics } from "../resend-audience";

const BODY_MAX = 4000;

// Same reasoning as consent/marketing.ts: called client→api with Authorization: Bearer <jwt>,
// so it must allow the `authorization` header. `*` origin is safe — never credentialed.
const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, OPTIONS",
  "access-control-allow-headers": "authorization, content-type",
};

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...CORS },
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

  const userId = await authenticate(request, env);
  if (!userId) return json({ error: "unauthorized" }, 401);

  const locale = await readProfileLocale(env.MAIN_DB, { userId });

  if (request.method === "GET") {
    const { categories, notices } = await fetchCategories(env, locale);
    const stored = await readPreferences(env.MAIN_DB, userId);
    const row = await env.MAIN_DB.prepare(
      "SELECT marketing_email FROM user_profiles WHERE user_id = ?",
    )
      .bind(userId)
      .first<{ marketing_email: number | null }>();
    const marketingEmail = row?.marketing_email;
    return json(
      {
        categories: categories.map((c) => ({
          key: c.key,
          name: c.name,
          description: c.description,
          includeAtSignup: c.includeAtSignup,
          granted: stored[c.key] ?? false,
        })),
        notices,
        marketing_email: marketingEmail == null ? null : marketingEmail === 1,
      },
      200,
    );
  }

  // POST — write updates.
  if (Number(request.headers.get("content-length") ?? 0) > BODY_MAX)
    return json({ error: "too_large" }, 413);
  let body: { updates?: unknown; surface?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return json({ error: "invalid" }, 400);
  }
  if (!Array.isArray(body.updates) || body.updates.length === 0)
    return json({ error: "invalid" }, 400);
  const updates: { key: string; granted: boolean }[] = [];
  for (const u of body.updates as { key?: unknown; granted?: unknown }[]) {
    if (typeof u?.key !== "string" || typeof u?.granted !== "boolean")
      return json({ error: "invalid" }, 400);
    updates.push({ key: u.key, granted: u.granted });
  }

  const { categories } = await fetchCategories(env, locale);
  const categoryByKey = new Map(categories.map((c) => [c.key, c]));
  for (const u of updates)
    if (!categoryByKey.has(u.key))
      return json({ error: "invalid_category" }, 400);
  const marketingKeys = categories.map((c) => c.key);
  const surface =
    (typeof body.surface === "string" ? body.surface : "").slice(0, 16) ||
    "account";
  const country = request.headers.get("cf-ipcountry") ?? null;

  const prof = await env.MAIN_DB.prepare(
    "SELECT email, email_fingerprint FROM user_profiles WHERE user_id = ?",
  )
    .bind(userId)
    .first<{ email: string | null; email_fingerprint: string | null }>();

  await writePreferences(env.MAIN_DB, {
    userId,
    fingerprint: prof?.email_fingerprint ?? null,
    updates,
    surface,
    country,
    marketingKeys,
  });

  // Best-effort Resend Topics mirror — never fails the write (the D1 rows are the source of
  // truth). Only the changed categories' topics, matching the POST payload.
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

  return json({ ok: true }, 200);
}

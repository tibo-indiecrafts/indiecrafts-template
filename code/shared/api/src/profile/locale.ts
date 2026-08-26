// Profile locale — an AUTHENTICATED write + a read hook. A signed-in user sets the
// language stored on their user_profiles row; the Clerk session JWT proves identity
// (userId from the `sub` claim). The read hook lets a worker-sent, authenticated
// email resolve the recipient's language. Mirrors erasure/self.ts (JWT verify), but
// needs only the userId — no email round-trip, no typed-email gate (non-destructive).
import { isLocale, localeCodes, type Locale } from "@indiecrafts/packages-shared-config";
import { type Env, PUBLIC_CORS_POST, clientIp } from "../index";

const BODY_MAX = 1000;

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...PUBLIC_CORS_POST },
  });
}

/** Verify the Clerk session JWT and return the caller's userId (`sub`), else null. */
async function defaultAuthenticate(request: Request, env: Env): Promise<string | null> {
  const token = (request.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  if (!token || !env.CLERK_SECRET_KEY) return null;
  try {
    const { verifyToken } = await import("@clerk/backend");
    const { data: claims, errors } = await verifyToken(token, { secretKey: env.CLERK_SECRET_KEY });
    if (errors || !claims) return null;
    const sub = (claims as { sub?: unknown }).sub;
    return typeof sub === "string" ? sub : null;
  } catch {
    return null; // fail closed
  }
}

/** Read the stored profile locale for a user; null when absent or unrecognised. */
export async function getProfileLocale(env: Env, userId: string): Promise<Locale | null> {
  if (!env.CORE_DB) return null;
  const row = await env.CORE_DB.prepare(
    "SELECT locale FROM user_profiles WHERE user_id = ?",
  ).bind(userId).first<{ locale: string | null }>();
  const value = row?.locale ?? "";
  return value && isLocale(value, localeCodes) ? value : null;
}

export async function handleProfileLocale(
  request: Request,
  env: Env,
  _ctx?: ExecutionContext,
  authenticate: (request: Request, env: Env) => Promise<string | null> = defaultAuthenticate,
): Promise<Response> {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: PUBLIC_CORS_POST });
  if (request.method !== "POST") return json({ error: "method_not_allowed" }, 405);
  if (!env.CORE_DB || !env.CLERK_SECRET_KEY) return json({ error: "unavailable" }, 503);
  if (Number(request.headers.get("content-length") ?? 0) > BODY_MAX) return json({ error: "too_large" }, 413);

  if (env.AGENT_RATELIMIT) {
    // Key on the caller IP, not the bearer token (a Clerk JWT's leading bytes are
    // shared across users). Matches /v1/erasure/self.
    const { success } = await env.AGENT_RATELIMIT.limit({ key: clientIp(request) });
    if (!success) return json({ error: "rate_limited" }, 429);
  }

  const userId = await authenticate(request, env);
  if (!userId) return json({ error: "unauthorized" }, 401);

  let locale = "";
  try {
    const body = (await request.json()) as { locale?: unknown };
    locale = String(body.locale ?? "").trim();
  } catch {
    return json({ error: "invalid" }, 400);
  }
  if (!isLocale(locale, localeCodes)) return json({ error: "invalid" }, 400);

  const now = new Date().toISOString();
  // Upsert: a signed-in user normally already has a row (session login), but insert
  // defensively so the write always lands. Explicit choice always wins (unconditional SET).
  await env.CORE_DB.prepare(
    "INSERT INTO user_profiles (user_id, created_at, locale) VALUES (?, ?, ?) " +
      "ON CONFLICT(user_id) DO UPDATE SET locale = excluded.locale",
  ).bind(userId, now, locale).run();

  return json({ locale }, 200);
}

// GDPR data export (Art. 15/20) — an AUTHENTICATED route. A signed-in user downloads a
// full export of their own data: the Clerk session JWT proves identity, `runExport`
// gathers every store, the bundle lands in R2, and a single-use expiring link is
// returned. Mirrors erasure/self.ts's auth pipeline (same seams, same secret
// preflight) and erasure/confirm.ts's hashed-token + TTL + single-use D1 pattern.
import { logger } from "@indiecrafts/packages-shared-logger";
import {
  fingerprintEmail,
  sha256Hex,
} from "@indiecrafts/packages-shared-security/crypto";
import {
  runExport,
  type ErasureAdapter,
} from "@indiecrafts/packages-shared-compliance/shared";
import { type Env, PUBLIC_CORS, PUBLIC_CORS_POST, clientIp } from "../index";
import {
  createCoreErasureAdapter,
  createAuditErasureAdapter,
} from "../erasure/d1";
import { createClerkErasureAdapter } from "../erasure/clerk";
import { createSanityErasureAdapter } from "../erasure/sanity";
import { createOrdersErasureAdapter } from "../erasure/orders";
import { createRealClerkClient } from "../erasure/clerk-client";
import { createRealSanityClient } from "../erasure/sanity-client";
import type { SelfAuth } from "../erasure/self";
import { readSettings } from "../settings-cache";

const BODY_MAX = 4000;
// Default download window (1h); the effective value is operator-overridable via
// site_settings (ttl.export_download_hours) — see settingsCache below.
const settingsCache: {
  value: null | { at: number; data: Record<string, number> };
} = {
  value: null,
};

interface ExportRequestRow {
  id: number;
  r2_key: string;
  expires_at: string;
  downloaded_at: string | null;
}

function json(
  body: unknown,
  status: number,
  cors: Record<string, string>,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...cors },
  });
}

/** The real five adapters (identical to erasure/self.ts). Injectable for tests. */
function defaultAdapters(env: Env): ErasureAdapter[] {
  return [
    createCoreErasureAdapter(env.CORE_DB!, env.GDPR_FINGERPRINT_SALT!),
    createAuditErasureAdapter(
      env.DB!,
      env.CORE_DB!,
      env.GDPR_FINGERPRINT_SALT!,
    ),
    createClerkErasureAdapter(createRealClerkClient(env.CLERK_SECRET_KEY!)),
    createSanityErasureAdapter(
      createRealSanityClient({
        projectId: env.SANITY_PROJECT_ID!,
        dataset: env.SANITY_DATASET!,
        apiVersion: env.SANITY_API_VERSION ?? "2025-01-01",
        writeToken: env.SANITY_API_WRITE_TOKEN!,
        readToken: env.SANITY_API_READ_TOKEN,
      }),
      env.GDPR_FINGERPRINT_SALT!,
    ),
    createOrdersErasureAdapter(),
  ];
}

/**
 * Verify the Clerk session JWT and resolve the caller's primary email (identical to
 * erasure/self.ts's defaultAuthenticate — not exported there, so replicated here).
 * Dynamic import keeps @clerk/backend out of the worker startup graph. Injectable so
 * tests never load the SDK or hit the network.
 */
async function defaultAuthenticate(
  request: Request,
  env: Env,
): Promise<SelfAuth | null> {
  const token = (request.headers.get("authorization") ?? "").replace(
    /^Bearer\s+/i,
    "",
  );
  if (!token || !env.CLERK_SECRET_KEY) return null;
  try {
    const { verifyToken } = await import("@clerk/backend");
    const { data: claims, errors } = await verifyToken(token, {
      secretKey: env.CLERK_SECRET_KEY,
    });
    if (errors || !claims) return null;
    const payload = claims as { sub?: unknown };
    const userId = typeof payload.sub === "string" ? payload.sub : null;
    if (!userId) return null;
    const user = await createRealClerkClient(env.CLERK_SECRET_KEY).exportUser(
      userId,
    );
    const u = user as {
      primaryEmailAddressId?: string | null;
      emailAddresses?: Array<{ id: string; emailAddress: string }>;
    };
    const email =
      u.emailAddresses?.find((e) => e.id === u.primaryEmailAddressId)
        ?.emailAddress ??
      u.emailAddresses?.[0]?.emailAddress ??
      null;
    if (!email) return null;
    // Export has no step-up requirement (unlike erasure/self.ts) — fvaMinutes is
    // carried only to satisfy the shared SelfAuth type.
    return { userId, email, fvaMinutes: null };
  } catch {
    return null; // any verify/resolve failure → unauthenticated (fail closed)
  }
}

export async function handleExport(
  request: Request,
  env: Env,
  ctx?: ExecutionContext,
  buildAdapters: (env: Env) => ErasureAdapter[] = defaultAdapters,
  authenticate: (
    request: Request,
    env: Env,
  ) => Promise<SelfAuth | null> = defaultAuthenticate,
): Promise<Response> {
  if (request.method === "OPTIONS")
    return new Response(null, { status: 204, headers: PUBLIC_CORS_POST });
  if (request.method !== "POST")
    return json({ error: "method_not_allowed" }, 405, PUBLIC_CORS_POST);

  // EXPORT_BUCKET is used directly by this route (independent of which adapters
  // build the data), so it belongs beside DB/CORE_DB/salt as an unconditional requirement.
  if (
    !env.DB ||
    !env.CORE_DB ||
    !env.GDPR_FINGERPRINT_SALT ||
    !env.EXPORT_BUCKET
  )
    return json({ error: "unavailable" }, 503, PUBLIC_CORS_POST);
  // JWT verification needs the Clerk secret; and when the real adapters are used,
  // the Sanity secrets must be armed too (see erasure/self.ts).
  if (!env.CLERK_SECRET_KEY)
    return json({ error: "unavailable" }, 503, PUBLIC_CORS_POST);
  if (
    buildAdapters === defaultAdapters &&
    (!env.SANITY_API_WRITE_TOKEN ||
      !env.SANITY_PROJECT_ID ||
      !env.SANITY_DATASET)
  )
    return json({ error: "unavailable" }, 503, PUBLIC_CORS_POST);

  if (Number(request.headers.get("content-length") ?? 0) > BODY_MAX)
    return json({ error: "too_large" }, 413, PUBLIC_CORS_POST);

  if (env.AGENT_RATELIMIT) {
    // Key on the caller IP, not the bearer token — matches erasure/self.ts.
    const { success } = await env.AGENT_RATELIMIT.limit({
      key: clientIp(request),
    });
    if (!success) return json({ error: "rate_limited" }, 429, PUBLIC_CORS_POST);
  }

  const authed = await authenticate(request, env);
  if (!authed) return json({ error: "unauthorized" }, 401, PUBLIC_CORS_POST);

  const adapters = buildAdapters(env);
  const bundle = await runExport(adapters, authed.email);
  // runExport stamps ts:"" itself — the caller supplies the real time.
  const stamped = { ...bundle, ts: new Date().toISOString() };

  const r2Key = "export/" + crypto.randomUUID() + ".json";
  await env.EXPORT_BUCKET.put(r2Key, JSON.stringify(stamped), {
    httpMetadata: { contentType: "application/json" },
  });

  const token = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const ttlH = (await readSettings(env.CORE_DB, settingsCache))[
    "ttl.export_download_hours"
  ];
  const expiresAt = new Date(Date.now() + ttlH * 3_600_000).toISOString();
  const fingerprint = await fingerprintEmail(
    authed.email,
    env.GDPR_FINGERPRINT_SALT,
  );

  // Not wrapped in try/catch: unlike erasure's fire-and-forget audit trail, this row
  // is the only handle to the download token — a failed write must surface as an error.
  await env.CORE_DB.prepare(
    "INSERT INTO export_requests (token_hash, r2_key, user_id, email_fingerprint, created_at, expires_at) VALUES (?, ?, ?, ?, ?, ?)",
  )
    .bind(
      await sha256Hex(token),
      r2Key,
      authed.userId,
      fingerprint,
      createdAt,
      expiresAt,
    )
    .run();

  try {
    const country = request.headers.get("cf-ipcountry") ?? null;
    await env.DB.prepare(
      "INSERT INTO admin_audit (ts, event, actor_user_id, target_user_id, country, ip_hash) VALUES (?, ?, ?, ?, ?, NULL)",
    )
      .bind(createdAt, "export.self", authed.userId, authed.userId, country)
      .run();
  } catch (error) {
    // The export is already committed; a bookkeeping failure must not 500 it.
    logger.error("export.self audit write failed", {
      name: (error as Error)?.name,
    });
  }

  return json(
    {
      downloadUrl: `${new URL(request.url).origin}/v1/export/download?token=${token}`,
    },
    200,
    PUBLIC_CORS_POST,
  );
}

export async function handleExportDownload(
  request: Request,
  env: Env,
  token: string,
): Promise<Response> {
  if (request.method === "OPTIONS")
    return new Response(null, { status: 204, headers: PUBLIC_CORS });
  if (request.method !== "GET")
    return json({ error: "method_not_allowed" }, 405, PUBLIC_CORS);

  // Guard BEFORE hashing — sha256Hex throws on an empty string.
  if (!token) return json({ error: "not_found" }, 404, PUBLIC_CORS);

  if (!env.CORE_DB || !env.EXPORT_BUCKET)
    return json({ error: "unavailable" }, 503, PUBLIC_CORS);

  const row = await env.CORE_DB.prepare(
    "SELECT id, r2_key, expires_at, downloaded_at FROM export_requests WHERE token_hash = ?",
  )
    .bind(await sha256Hex(token))
    .first<ExportRequestRow>();

  if (
    !row ||
    row.downloaded_at !== null ||
    new Date().toISOString() > row.expires_at
  )
    return json({ error: "invalid" }, 400, PUBLIC_CORS);

  // Single-use CLAIM: the conditional `AND downloaded_at IS NULL` makes it atomic — only
  // one of two near-simultaneous requests with the same token wins. `changes === 0` means
  // another request already claimed it → 400, same as an already-used row.
  const claim = await env.CORE_DB.prepare(
    "UPDATE export_requests SET downloaded_at = ? WHERE id = ? AND downloaded_at IS NULL",
  )
    .bind(new Date().toISOString(), row.id)
    .run();
  if (claim.meta.changes !== 1)
    return json({ error: "invalid" }, 400, PUBLIC_CORS);

  const obj = await env.EXPORT_BUCKET.get(row.r2_key);
  if (!obj) return json({ error: "gone" }, 410, PUBLIC_CORS);

  // Read fully into memory before deleting — streaming obj.body while deleting the
  // underlying object could race; reading first makes delete-after-read safe.
  const body = await obj.arrayBuffer();
  await env.EXPORT_BUCKET.delete(row.r2_key);

  return new Response(body, {
    status: 200,
    headers: {
      "content-type": "application/json",
      "content-disposition": 'attachment; filename="my-data-export.json"',
      // The response body is the caller's full personal-data export — never cache it.
      "cache-control": "no-store",
      ...PUBLIC_CORS,
    },
  });
}

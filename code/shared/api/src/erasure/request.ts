/**
 * File a GDPR erasure request without leaking which emails exist.
 *
 * @see docs/reference/shared/api/src/erasure/request.md
 */
// GDPR erasure request — GET renders the request form, POST files a request.
// Anti-enumeration (spec §8.2): the POST response is IDENTICAL whether or not the
// email matches a subject, so an attacker cannot use this route to test which
// emails exist. A row + token email are only ever created for a matched subject.
import { fetchWithTimeout } from "../http";
import { logger } from "@indiecrafts/packages-shared-logger";
import {
  fingerprintEmail,
  sha256Hex,
} from "@indiecrafts/packages-shared-security/crypto";
import { type Env, PUBLIC_CORS_POST, clientIp } from "../index";
import { sendErasureTokenEmail } from "./email";
import { readSettings } from "../settings-cache";

const BODY_MAX = 4000;
// Default confirm-link expiry (24h); the effective value is operator-overridable
// via site_settings (ttl.erasure_confirm_hours) — see settingsCache below.
const settingsCache: {
  value: null | { at: number; data: Record<string, number> };
} = {
  value: null,
};
const DUE_MS = 30 * 24 * 60 * 60 * 1000; // the GDPR one-month SLA target — NOT a knob

const GENERIC_RESPONSE = {
  ok: true,
  message:
    "If that address is in our records, we've emailed a confirmation link.",
};

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

/**
 * Verify a Cloudflare Turnstile token. Mirrors the agent worker's inline verifier
 * (the security brick's own version is `server-only`, which breaks the esbuild
 * build). Opt-in: an unset secret PASSES; a set secret fails CLOSED on a verify
 * error, so a Turnstile outage never becomes an open door.
 */
async function verifyTurnstile(
  env: Env,
  token: string,
  ip: string,
): Promise<boolean> {
  if (!env.TURNSTILE_SECRET) return true;
  if (!token) return false;
  try {
    const res = await fetchWithTimeout(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          secret: env.TURNSTILE_SECRET,
          response: token,
          remoteip: ip,
        }),
      },
    );
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false; // verify unreachable while Turnstile IS configured → fail closed
  }
}

// Minimal, self-contained (no app framework/styling) — the branded/i18n form is a
// deferred slice. The Turnstile widget needs its real site key wired in before this
// goes live; the div below is the placeholder the brief asks for.
const REQUEST_FORM_HTML = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Request data erasure</title>
    <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
  </head>
  <body>
    <h1>Request data erasure</h1>
    <p>Enter your account email. If we find a match, we will email you a confirmation link.</p>
    <form method="post" action="/v1/erasure/request">
      <label for="email">Email</label>
      <input id="email" name="email" type="email" required />
      <div class="cf-turnstile" data-sitekey="YOUR_TURNSTILE_SITE_KEY"></div>
      <button type="submit">Send confirmation link</button>
    </form>
  </body>
</html>`;

export async function handleErasureRequest(
  request: Request,
  env: Env,
  ctx?: ExecutionContext,
  // Injectable for tests (the vitest-pool-workers runtime loads the worker into its
  // own isolate, so `vi.mock` can't reach in) — production never passes this.
  sendToken: typeof sendErasureTokenEmail = sendErasureTokenEmail,
): Promise<Response> {
  if (request.method === "OPTIONS")
    return new Response(null, { status: 204, headers: PUBLIC_CORS_POST });

  if (request.method === "GET")
    return new Response(REQUEST_FORM_HTML, {
      status: 200,
      headers: {
        "content-type": "text/html; charset=utf-8",
        ...PUBLIC_CORS_POST,
      },
    });

  if (request.method !== "POST")
    return json({ error: "method_not_allowed" }, 405, PUBLIC_CORS_POST);

  // The public erasure-request path must have at least one abuse control — a bot
  // challenge or a rate limit. Neither configured → refuse, rather than run an
  // unthrottled, unchallenged public POST that can email-bomb a known victim.
  if (!env.TURNSTILE_SECRET && !env.RATELIMIT)
    return json({ error: "unavailable" }, 503, PUBLIC_CORS_POST);

  if (env.RATELIMIT) {
    const { success } = await env.RATELIMIT.limit({
      key: clientIp(request),
    });
    if (!success) return json({ error: "rate_limited" }, 429, PUBLIC_CORS_POST);
  }

  if (Number(request.headers.get("content-length") ?? 0) > BODY_MAX)
    return json({ error: "too_large" }, 413, PUBLIC_CORS_POST);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ error: "invalid" }, 400, PUBLIC_CORS_POST);
  }

  const email = String(form.get("email") ?? "").trim();
  const turnstileToken = String(form.get("cf-turnstile-response") ?? "");

  if (!(await verifyTurnstile(env, turnstileToken, clientIp(request))))
    return json({ error: "turnstile_failed" }, 403, PUBLIC_CORS_POST);

  // No email, or the flow isn't configured yet — still the generic response,
  // never a distinguishable error, so this never becomes an enumeration oracle.
  if (!email || !env.MAIN_DB || !env.GDPR_FINGERPRINT_SALT)
    return json(GENERIC_RESPONSE, 200, PUBLIC_CORS_POST);

  try {
    const fp = await fingerprintEmail(email, env.GDPR_FINGERPRINT_SALT);
    const subject = await env.MAIN_DB.prepare(
      "SELECT user_id, locale FROM user_profiles WHERE email_fingerprint = ? OR LOWER(email) = ?",
    )
      .bind(fp, email.toLowerCase().trim())
      .first<{ user_id: string | null; locale: string | null }>();

    if (subject) {
      // The INSERT + email are backgrounded as one unit: both the found and
      // not-found paths must respond right after the SELECT, or the extra D1
      // write on the found path becomes a timing signal (partial enumeration).
      const origin = new URL(request.url).origin;
      const writeAndSend = async (): Promise<void> => {
        const token = crypto.randomUUID();
        const now = Date.now();
        const ttlH = (await readSettings(env.MAIN_DB, settingsCache))[
          "ttl.erasure_confirm_hours"
        ];
        await env
          .MAIN_DB!.prepare(
            "INSERT INTO erasure_requests (status, token_hash, token_expires_at, attempts, user_id, email_fingerprint, requested_at, due_at) VALUES (?, ?, ?, 0, ?, ?, ?, ?)",
          )
          .bind(
            "email_sent",
            await sha256Hex(token),
            new Date(now + ttlH * 3_600_000).toISOString(),
            subject.user_id ?? null,
            fp,
            new Date(now).toISOString(),
            new Date(now + DUE_MS).toISOString(),
          )
          .run();

        // The plaintext token only ever travels in this email — never stored.
        const confirmUrl = env.WEBSITE_URL
          ? `${env.WEBSITE_URL}/erasure/confirm?token=${token}`
          : `${origin}/v1/erasure/confirm?token=${token}`;
        await sendToken(env, {
          to: email,
          confirmUrl,
          locale: subject.locale ?? undefined,
        });
      };

      if (ctx) {
        // Backgrounded: the response is already gone, so a failure here can only
        // be logged, never turned into an error response.
        ctx.waitUntil(
          writeAndSend().catch((error: unknown) => {
            logger.error("erasure request background write failed", {
              name: (error as Error)?.name,
            });
          }),
        );
      } else {
        await writeAndSend();
      }
    }
  } catch (error) {
    logger.error("erasure request failed", { name: (error as Error)?.name });
    return json({ error: "server" }, 502, PUBLIC_CORS_POST);
  }

  return json(GENERIC_RESPONSE, 200, PUBLIC_CORS_POST);
}

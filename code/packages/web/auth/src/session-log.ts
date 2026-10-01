/**
 * Forward a session event to the shared api, server-side.
 *
 * @see docs/reference/packages/web/auth/src/session-log.md
 */
import "server-only";
import { apiFetch } from "@indiecrafts/packages-shared-utils/api-fetch";

/**
 * Forward a sign-in/session event to the shared api's `/v1/events` (which writes the
 * EU D1 `session_events`). Holds `APP_API_TOKEN` server-side — NEVER shipped to the
 * browser. No-ops when unconfigured. Fire-and-forget: never blocks or throws into the
 * caller (a route handler awaits it, but an api hiccup must not 500 the request).
 */
export async function logSession(input: {
  surface: string;
  userId: string;
  sessionId?: string | null;
  country?: string | null;
  /** The visitor's IP — the api rate-limits per visitor, not per server. */
  clientIp?: string;
}): Promise<void> {
  const url = process.env.API_URL;
  const token = process.env.APP_API_TOKEN;
  if (!url || !token) return;
  try {
    await apiFetch(`${url}/v1/events`, {
      method: "POST",
      idempotent: true,
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
        ...(input.clientIp ? { "x-client-ip": input.clientIp } : {}),
      },
      body: JSON.stringify({
        kind: "session",
        surface: input.surface.slice(0, 16),
        userId: input.userId,
        sessionId: input.sessionId ?? undefined,
        country: input.country ?? undefined,
      }),
    });
  } catch {
    // fire-and-forget
  }
}

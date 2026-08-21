/**
 * Fire-and-forget: log this sign-in to the shared api's `/v1/events` (EU D1 session
 * log). Uses the bundled public api url + token (the same abuse gate as the agent —
 * `EXPO_PUBLIC_*` ships in the binary). Never throws; the caller dedups per session.
 */
export async function logSignIn(userId: string, sessionId?: string): Promise<void> {
  const url = process.env.EXPO_PUBLIC_API_URL;
  const token = process.env.EXPO_PUBLIC_AGENT_TOKEN;
  if (!url || !token) return;
  try {
    await fetch(`${url}/v1/events`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ kind: "session", surface: "mobile", userId, sessionId }),
    });
  } catch {
    // fire-and-forget
  }
}

/**
 * Fire-and-forget: report a failed sign-in (a wrong OTP code) to the api. The api COUNTS
 * these at the edge (KV) and stores an incident only once a threshold is crossed — no PII
 * (no email), keyed by the hashed IP server-side. Native surfaces drive OTP by hand, so
 * this is the one place we can see a failed attempt; the web/hybrid surfaces use Clerk's
 * own UI and rely on Cloudflare's edge WAF + the Clerk webhook instead.
 */
export async function logFailedLogin(): Promise<void> {
  const url = process.env.EXPO_PUBLIC_API_URL;
  const token = process.env.EXPO_PUBLIC_AGENT_TOKEN;
  if (!url || !token) return;
  try {
    await fetch(`${url}/v1/events`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        kind: "security",
        eventType: "failed_login",
        severity: "low",
        surface: "mobile",
      }),
    });
  } catch {
    // fire-and-forget
  }
}

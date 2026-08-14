import "server-only";

/**
 * Verify a Cloudflare Turnstile token against the siteverify API.
 *
 * **Opt-in.** When `TURNSTILE_SECRET` is unset — a fresh install, or any client
 * who hasn't enabled Turnstile — this **passes**, so the per-engine honeypot stays
 * the bot defense and nothing breaks. Set the key pair to turn it on. When the
 * secret IS set, a verify error fails **closed** (a real challenge must succeed).
 *
 * The public site key is `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (client widget); the
 * secret never leaves the server.
 */
export async function verifyTurnstile(token: string, ip?: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET;
  if (!secret) return true; // unconfigured → no-op pass (honeypot still guards)
  if (!token) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ secret, response: token, ...(ip ? { remoteip: ip } : {}) }),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false; // verify unreachable while Turnstile IS configured → fail closed
  }
}

/** Whether a Turnstile widget should render (public site key present). */
export function turnstileEnabled(): boolean {
  return !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
}

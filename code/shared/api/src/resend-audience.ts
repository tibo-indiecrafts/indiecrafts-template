// Mirror a marketing-email consent decision to a Resend "audience" (contact list).
// Sibling of `erasure/email.ts` — same inline-`fetch` + injectable-seam pattern, no
// `server-only`, no new deps. Best-effort by contract: callers wrap these in try/catch and
// log, so a Resend hiccup never blocks the D1 write that is the real source of truth.
//
// Unset `RESEND_AUDIENCE_ID` (or `RESEND_API_KEY`) → every function no-ops, so the whole
// feature degrades to capture-only when Resend is unconfigured.

/** The Env slice this module needs — never the full worker `Env`. */
export type ResendAudienceEnv = {
  RESEND_API_KEY?: string;
  RESEND_AUDIENCE_ID?: string;
};

const RESEND_API = "https://api.resend.com";

/** Create-or-update the audience contact with `unsubscribed = !granted`. Resend keys
 *  contacts by email; a POST for an existing email 4xxs, so we fall back to a PATCH by
 *  email. Raw email in the path — `@ . +` are all valid path chars, no encoding needed. */
export async function upsertResendContact(
  env: ResendAudienceEnv,
  { email, granted }: { email: string; granted: boolean },
  doFetch: typeof fetch = fetch,
): Promise<void> {
  if (!env.RESEND_API_KEY || !env.RESEND_AUDIENCE_ID || !email) return;
  const base = `${RESEND_API}/audiences/${env.RESEND_AUDIENCE_ID}/contacts`;
  const headers = {
    Authorization: `Bearer ${env.RESEND_API_KEY}`,
    "content-type": "application/json",
  };
  const unsubscribed = !granted;

  const res = await doFetch(base, {
    method: "POST",
    headers,
    body: JSON.stringify({ email, unsubscribed }),
  });
  if (res.ok) return;
  // Already exists → update by email. (Resend returns 409/422 for a duplicate contact.)
  if (res.status === 409 || res.status === 422) {
    const patch = await doFetch(`${base}/${email}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ unsubscribed }),
    });
    if (!patch.ok) throw new Error(`resend ${patch.status}`);
    return;
  }
  throw new Error(`resend ${res.status}`);
}

/** Remove the contact from the audience — the erasure "pure delete" (no win-back list).
 *  A 404 (already gone) is success. */
export async function deleteResendContact(
  env: ResendAudienceEnv,
  { email }: { email: string },
  doFetch: typeof fetch = fetch,
): Promise<void> {
  if (!env.RESEND_API_KEY || !env.RESEND_AUDIENCE_ID || !email) return;
  const res = await doFetch(
    `${RESEND_API}/audiences/${env.RESEND_AUDIENCE_ID}/contacts/${email}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}` },
    },
  );
  if (!res.ok && res.status !== 404) throw new Error(`resend ${res.status}`);
}

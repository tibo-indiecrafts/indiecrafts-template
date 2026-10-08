/**
 * Make a confirmed newsletter subscriber a Resend contact through the shared api.
 *
 * @see docs/reference/modules/web/newsletter/src/lib/newsletter-contact.md
 */
import "server-only";

import { apiFetch } from "@indiecrafts/packages-shared-utils/api-fetch";

/** True when the website can reach the api (`API_URL` + `APP_API_TOKEN`). */
export function newsletterApiConfigured(): boolean {
  return !!process.env.API_URL && !!process.env.APP_API_TOKEN;
}

/**
 * Resend is the newsletter's only list. On confirm, the api (`POST /v1/newsletter/subscribers`)
 * records the consent proof in D1, then upserts the Resend contact: the `news` topic, the
 * `locale` property and the `newsletter-<locale>` segment, so one Broadcast per language
 * reaches the right people.
 *
 * Throws when the api is unconfigured or answers non-2xx: the confirmation must not report
 * success for a subscriber that was never stored. The caller logs it (never the address).
 */
export async function subscribeContact(input: {
  email: string;
  locale: string;
  policyVersion: string;
  /** The confirm token's issue time — the moment the visitor gave consent. */
  consentAt: string;
}): Promise<void> {
  const url = process.env.API_URL;
  const token = process.env.APP_API_TOKEN;
  if (!url || !token) throw new Error("newsletter api unconfigured");
  const res = await apiFetch(`${url}/v1/newsletter/subscribers`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(input),
    timeoutMs: 5000,
  });
  if (!res.ok) throw new Error(`newsletter/subscribers ${res.status}`);
}

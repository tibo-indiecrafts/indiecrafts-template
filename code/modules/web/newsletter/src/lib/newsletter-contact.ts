/**
 * Mirror a newsletter subscriber to Resend's `news` topic through the shared api.
 *
 * @see docs/reference/modules/web/newsletter/src/lib/newsletter-contact.md
 */
import "server-only";

import { logger } from "@indiecrafts/packages-shared-logger";
import { apiFetch } from "@indiecrafts/packages-shared-utils/api-fetch";

/**
 * The Sanity `subscriber` doc is the newsletter's source of truth; the api mirrors it into
 * Resend (`POST /v1/newsletter/subscribers` → the contact + the `news` topic, the same topic
 * signed-in opt-ins use), so one Resend Broadcast reaches both. An unsubscribe made in
 * Resend comes back to the doc through the api's Resend webhook.
 *
 * Best-effort: a lost sync never fails the confirmation — it is logged (never the address).
 * Without `API_URL` / `APP_API_TOKEN` it does nothing: the list stays Sanity-only.
 */
export async function syncNewsletterContact(input: {
  email: string;
  locale: string;
  granted: boolean;
}): Promise<void> {
  const url = process.env.API_URL;
  const token = process.env.APP_API_TOKEN;
  if (!url || !token) return;
  try {
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
  } catch (error) {
    logger.error("newsletter Resend sync failed", {
      granted: input.granted,
      error,
    });
  }
}

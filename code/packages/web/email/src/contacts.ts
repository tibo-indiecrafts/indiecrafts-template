/**
 * Add a waitlist or contact-form person to the Resend contacts, through the shared api.
 *
 * @see docs/reference/packages/web/email/src/contacts.md
 */
import "server-only";

import { apiFetch } from "@indiecrafts/packages-shared-utils/api-fetch";

export type GeneralContact = {
  email: string;
  locale: string;
  /** `waitlist` opts into the General topic (its consent covers early-access news);
   *  `contact` is stored only (its consent covers a reply, not broadcasts). */
  source: "waitlist" | "contact";
  /** Waitlist only: the consent proof the api records in D1. */
  policyVersion?: string;
  consentAt?: string;
};

/**
 * `POST /v1/contacts/general` — the api upserts the Resend contact on the General topic (and,
 * for a waitlist join, records the consent). The Sanity document is the record of truth, so
 * this is best-effort: it never throws, and an unconfigured api (`API_URL`/`APP_API_TOKEN`)
 * skips it. Logs nothing itself — the caller logs a failure without the address.
 */
export async function addGeneralContact(
  input: GeneralContact,
): Promise<"added" | "skipped" | "failed"> {
  const url = process.env.API_URL;
  const token = process.env.APP_API_TOKEN;
  if (!url || !token) return "skipped";
  try {
    const res = await apiFetch(`${url}/v1/contacts/general`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(input),
      // An upsert is idempotent (same contact, same topic state), so one retry is safe.
      idempotent: true,
    });
    return res.ok ? "added" : "failed";
  } catch {
    return "failed";
  }
}

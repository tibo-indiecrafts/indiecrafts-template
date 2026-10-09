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
  /** The visitor's IP: the api rate-limits per visitor (`x-client-ip`), not per website. */
  clientIp?: string;
};

/**
 * `POST /v1/contacts/general` — the api upserts the Resend contact (and, for a waitlist join,
 * records the consent). The Sanity document is the record of truth, so this is best-effort: it
 * never throws, an unconfigured api (`API_URL`/`APP_API_TOKEN`) skips it, and it waits at most
 * 4 s with no retry, so a slow Resend never holds the visitor's submit for long. Logs nothing
 * itself — the caller logs a failure without the address.
 */
export async function addGeneralContact(
  input: GeneralContact,
): Promise<"added" | "skipped" | "failed"> {
  const url = process.env.API_URL;
  const token = process.env.APP_API_TOKEN;
  if (!url || !token) return "skipped";
  const { clientIp, ...body } = input;
  try {
    const res = await apiFetch(`${url}/v1/contacts/general`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
        ...(clientIp ? { "x-client-ip": clientIp } : {}),
      },
      body: JSON.stringify(body),
      // ponytail: bounded and not retried — runs inside the visitor's request. Move it to
      // `after()` (from `next/server`) once the Workers adapter is verified to honour it.
      timeoutMs: 4_000,
    });
    return res.ok ? "added" : "failed";
  } catch {
    return "failed";
  }
}

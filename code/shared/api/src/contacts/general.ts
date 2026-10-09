/**
 * Add a waitlist or contact-form person to the Resend contacts, on the General topic.
 *
 * @see docs/reference/shared/api/src/contacts/general.md
 */
// The website calls POST /v1/contacts/general after it saves a waitlist entry or a contact
// message; the Sanity document stays the record. A waitlist join opts into the `general` topic
// (its consent covers early-access news) and its proof goes to D1. A contact message only
// stores the contact: that consent covers a reply, not broadcasts.
import type { Env } from "../index";
import { fetchWithTimeout } from "../http";
import { fetchEmailPreferences } from "../consent/email-preferences-sanity";

export type GeneralSource = "waitlist" | "contact";

export const isGeneralSource = (value: unknown): value is GeneralSource =>
  value === "waitlist" || value === "contact";

/** The `general` topic id from the Studio `emailPreferences` singleton, or undefined (no
 *  category, no id, or Sanity unreachable — the reader falls back to the news-only default). */
export async function generalTopicId(
  env: Env,
  locale: string,
  doFetch: typeof fetch = fetchWithTimeout,
): Promise<string | undefined> {
  const { categories } = await fetchEmailPreferences(env, locale, doFetch);
  return categories.find((c) => c.key === "general")?.resendTopicId;
}

/** The person's own General choice in the preference centre (an account's
 *  `email_preferences` row, found by the email fingerprint), or undefined when they never
 *  made one. Resend topics are private, so this is the only place they can turn it off. */
export async function generalChoice(
  db: D1Database,
  fingerprint: string,
): Promise<boolean | undefined> {
  const row = await db
    .prepare(
      "SELECT p.granted FROM email_preferences p JOIN user_profiles u ON u.user_id = p.user_id " +
        "WHERE u.email_fingerprint = ? AND p.category_key = 'general' LIMIT 1",
    )
    .bind(fingerprint)
    .first<{ granted: number }>();
  return row ? row.granted === 1 : undefined;
}

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
import { addGeneralContact } from "../resend-audience";

export type GeneralSource = "waitlist" | "contact";

export const isGeneralSource = (value: unknown): value is GeneralSource =>
  value === "waitlist" || value === "contact";

/** Upsert the Resend contact. The `general` topic id comes from the Studio `emailPreferences`
 *  singleton (none set → no topic). Throws on a Resend error. */
export async function syncGeneralContact(
  env: Env,
  {
    email,
    locale,
    source,
  }: { email: string; locale: string; source: GeneralSource },
  doFetch: typeof fetch = fetchWithTimeout,
): Promise<void> {
  const topicId =
    source === "waitlist"
      ? (await fetchEmailPreferences(env, locale, doFetch)).categories.find(
          (c) => c.key === "general",
        )?.resendTopicId
      : undefined;
  await addGeneralContact(env, { email, locale, topicId }, doFetch);
}

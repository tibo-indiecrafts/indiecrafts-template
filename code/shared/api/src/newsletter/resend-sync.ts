/**
 * Record a newsletter double opt-in in D1 and make the person a Resend subscriber.
 *
 * @see docs/reference/shared/api/src/newsletter/resend-sync.md
 */
// Resend is the newsletter's only list. The website stores nothing at sign-up: it emails a
// signed confirm link, and on the click its server calls POST /v1/newsletter/subscribers.
// The route then (1) appends the consent proof to `consent_events` and (2) upserts the Resend
// contact (`news` topic, `locale` property, language segment). Unsubscribe is Resend's own
// link — nothing here handles it.
import { fingerprintEmail } from "@indiecrafts/packages-shared-security/crypto";
import { isValidEmail } from "@indiecrafts/packages-shared-utils/form";
import type { Env } from "../index";
import { fetchWithTimeout } from "../http";
import { fetchEmailPreferences } from "../consent/email-preferences-sanity";
import { subscribeNewsletterContact } from "../resend-audience";

/** `isValidEmail` plus no URL-path characters — the email goes raw into Resend's path. */
export function isNewsletterEmail(value: unknown): value is string {
  return (
    typeof value === "string" && isValidEmail(value) && !/[/?#%\\]/.test(value)
  );
}

/** An ISO 8601 date-time (`2026-10-08T09:30:00.000Z`). */
export function isConsentTime(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length <= 40 &&
    /^\d{4}-\d{2}-\d{2}T/.test(value) &&
    !Number.isNaN(Date.parse(value))
  );
}

/** Append the double opt-in proof: a `visitor` row keyed by the email fingerprint, never the
 *  email. No country and no IP hash: the caller is the website server, not the visitor. `consentAt` is the confirm-token issue time; the idempotency key holds it, so a
 *  repeat click on the same link adds no second row. A waitlist join records its own consent
 *  the same way (`consentType: "waitlist"`, `source: "waitlist"`). */
export async function recordNewsletterConsent(
  db: D1Database,
  salt: string,
  {
    email,
    policyVersion,
    consentAt,
    consentType = "newsletter",
    source = "double_opt_in",
  }: {
    email: string;
    policyVersion: string;
    consentAt: string;
    consentType?: "newsletter" | "waitlist";
    source?: "double_opt_in" | "waitlist";
  },
): Promise<void> {
  const fp = await fingerprintEmail(email, salt);
  await db
    .prepare(
      "INSERT OR IGNORE INTO consent_events (ts, subject_type, subject_id, email_fingerprint, consent_type, granted, policy_version, surface, source, country, ip_hash, idempotency_key) " +
        "VALUES (?, 'visitor', ?, ?, ?, 1, ?, 'website', ?, NULL, NULL, ?)",
    )
    .bind(
      consentAt,
      fp,
      fp,
      consentType,
      policyVersion || "unknown",
      source,
      `${consentType}:${fp}:${consentAt}`,
    )
    .run();
}

/** Upsert the Resend contact as a newsletter subscriber. The `news` topic id comes from the
 *  Studio `emailPreferences` singleton (none set → no topic). Throws on a Resend error. */
export async function syncNewsletterSubscriber(
  env: Env,
  { email, locale }: { email: string; locale: string },
  doFetch: typeof fetch = fetchWithTimeout,
): Promise<void> {
  const { categories } = await fetchEmailPreferences(env, locale, doFetch);
  const topicId = categories.find((c) => c.key === "news")?.resendTopicId;
  await subscribeNewsletterContact(env, { email, locale, topicId }, doFetch);
}

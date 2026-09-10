import { logger } from "@indiecrafts/packages-shared-logger";
import { defaultLocale } from "@indiecrafts/packages-shared-config";
import { fingerprintEmail } from "@indiecrafts/packages-shared-security/crypto";
import { resend, type MailEnv } from "../erasure/email";
import { AUTH_TEMPLATES, type EmailVars } from "./templates";
import {
  canonicalAuthSlug,
  fetchAuthEmailStrings,
  resolveAuthCopy,
} from "./sanity";

/** The Env slice this handler needs — the mailer (`MailEnv`) plus a read handle to
 *  MAIN_DB for the user's stored locale + the fingerprint salt. */
export type ClerkEmailEnv = MailEnv & {
  MAIN_DB?: D1Database;
  GDPR_FINGERPRINT_SALT?: string;
};

const str = (v: unknown): string => (typeof v === "string" ? v : "");

/** The `emails.created` payload we read. Defensive: Clerk field names are stable per
 *  template but vary a little, and unread fields are ignored. */
type ClerkEmailData = {
  to_email_address?: unknown;
  slug?: unknown;
  subject?: unknown;
  body?: unknown;
  user_id?: unknown;
  data?: EmailVars;
};

/** The user's stored locale — by Clerk user id, else by email fingerprint, else the
 *  default. Never throws: a lookup failure must not stop a mandatory auth email. */
async function resolveLocale(
  env: ClerkEmailEnv,
  d: ClerkEmailData,
): Promise<string> {
  if (!env.MAIN_DB) return defaultLocale;
  try {
    const userId =
      str(d.user_id) ||
      str((d.data as { user_id?: unknown } | undefined)?.user_id);
    const to = str(d.to_email_address);
    let row: { locale?: string | null } | null = null;
    if (userId) {
      row = await env.MAIN_DB.prepare(
        "SELECT locale FROM user_profiles WHERE user_id = ?",
      )
        .bind(userId)
        .first();
    } else if (to && env.GDPR_FINGERPRINT_SALT) {
      const fp = await fingerprintEmail(to, env.GDPR_FINGERPRINT_SALT);
      row = await env.MAIN_DB.prepare(
        "SELECT locale FROM user_profiles WHERE email_fingerprint = ?",
      )
        .bind(fp)
        .first();
    }
    return str(row?.locale) || defaultLocale;
  } catch {
    return defaultLocale;
  }
}

/**
 * Handle a Clerk `emails.created` event (fired when "Delivered by Clerk" is toggled
 * off): render a LOCALIZED auth email from the event's `data` variables and send it
 * via Resend, in the user's stored locale (`user_profiles.locale`, else the default).
 * A known template `slug` is localized; an unknown slug forwards Clerk's own rendered
 * (English) body so nothing is dropped. THROWS when the mailer is unset or the send
 * fails, so the caller returns 502 and Clerk retries — a verification code must not be
 * silently lost. The rendered copy uses the Studio-editable `emailStrings` overlay when
 * set (per field, in the recipient's locale), else the template's hardcoded en/fr.
 * `send` + `fetchStrings` are injectable for tests.
 */
export async function handleClerkEmail(
  env: ClerkEmailEnv,
  data: unknown,
  send: typeof resend = resend,
  fetchStrings: typeof fetchAuthEmailStrings = fetchAuthEmailStrings,
): Promise<void> {
  const d = (data ?? {}) as ClerkEmailData;
  const to = str(d.to_email_address);
  if (!to) return; // no recipient — nothing to send
  if (!env.RESEND_API_KEY || !env.EMAIL_FROM)
    throw new Error("mailer unconfigured");

  const locale = await resolveLocale(env, d);
  const slug = str(d.slug);
  // Clerk's exact slugs vary (the new-device one is undocumented), so match forgivingly
  // to our canonical template slug rather than an exact key.
  const canonical = canonicalAuthSlug(slug);
  const tpl = canonical ? AUTH_TEMPLATES[canonical] : undefined;
  if (tpl) {
    // Studio override (Sanity `emailStrings`), resolved to the recipient's locale; null/
    // unset → the template's hardcoded copy. Never throws (a missing Studio must not stop
    // a mandatory auth email).
    const copy = resolveAuthCopy(await fetchStrings(env), slug, locale);
    const { subject, html, text } = tpl(d.data ?? {}, locale, copy);
    await send(env, { to, subject, html, text });
    return;
  }
  // Unknown slug → forward Clerk's own rendered (English) email; never drop it. Log the
  // slug (no PII) so an operator can discover a template worth localizing — e.g. the real
  // "sign in from new device" slug, which Clerk does not document.
  logger.info("clerk email passthrough (unlocalized slug)", {
    slug: str(d.slug),
  });
  const subject = str(d.subject) || "Notification";
  const body = str(d.body);
  await send(env, {
    to,
    subject,
    html: body || `<p>${subject.replaceAll("<", "&lt;")}</p>`,
    text: subject,
  });
}

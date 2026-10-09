/**
 * Render and send a localized Clerk auth email from an email.created event.
 *
 * @see docs/reference/shared/api/src/clerk-email/handle.md
 */
import { logger } from "@indiecrafts/packages-shared-logger";
import { defaultLocale } from "@indiecrafts/packages-shared-config";
import { fingerprintEmail } from "@indiecrafts/packages-shared-security/crypto";
import {
  inLanguage,
  readProfileLocale,
  resend,
  supportFooter,
  type MailEnv,
} from "../erasure/email";
import { AUTH_TEMPLATES, type EmailVars } from "./templates";
import {
  authSupportCopy,
  canonicalAuthSlug,
  fetchAuthEmailStrings,
  resolveAuthCopy,
  type AuthEmailStrings,
} from "./sanity";

/** The Env slice this handler needs — the mailer (`MailEnv`) plus a read handle to
 *  MAIN_DB for the user's stored locale + the fingerprint salt. */
export type ClerkEmailEnv = MailEnv & {
  MAIN_DB?: D1Database;
  GDPR_FINGERPRINT_SALT?: string;
  /** The website origin — the new-device email links to its `/account` device list. */
  WEBSITE_URL?: string;
};

const str = (v: unknown): string => (typeof v === "string" ? v : "");

/** The `email.created` payload we read. Defensive: Clerk field names are stable per
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
 *  default. Delegates the DB read to the shared `readProfileLocale`; never throws (a
 *  lookup failure must not stop a mandatory auth email). */
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
    // Only fingerprint when there's no user id (the fingerprint path is the fallback).
    const fingerprint =
      !userId && to && env.GDPR_FINGERPRINT_SALT
        ? await fingerprintEmail(to, env.GDPR_FINGERPRINT_SALT)
        : undefined;
    return await readProfileLocale(env.MAIN_DB, {
      userId: userId || undefined,
      fingerprint,
    });
  } catch {
    return defaultLocale;
  }
}

/**
 * Render a known Clerk template in `locale` — the Studio copy (`clerkEmails`) over the
 * template's hardcoded en/fr, the support footer, `<div lang>` — and send it. Returns false
 * for a slug we don't localize (nothing sent). Shared by the webhook and the Studio test.
 */
export async function sendAuthTemplate(
  env: ClerkEmailEnv,
  {
    to,
    slug,
    locale,
    vars,
  }: { to: string; slug: string; locale: string; vars?: EmailVars },
  strings: AuthEmailStrings | null,
  send: typeof resend = resend,
): Promise<boolean> {
  // Clerk's exact slugs vary (the new-device one is undocumented), so match forgivingly
  // to our canonical template slug rather than an exact key.
  const canonical = canonicalAuthSlug(slug);
  const tpl = canonical ? AUTH_TEMPLATES[canonical] : undefined;
  if (!tpl) return false;
  const foot = supportFooter(strings?.supportEmail, locale);
  // Studio override, resolved to the recipient's locale; unset → the hardcoded copy.
  const copy = resolveAuthCopy(strings, slug, locale);
  // Our own link next to Clerk's variables: the device list where the user signs out
  // a device (the new-device email's fallback when Clerk sends no revoke link).
  const all = {
    ...vars,
    ...(env.WEBSITE_URL && {
      account_security_url: `${env.WEBSITE_URL}/account#/security`,
    }),
  };
  const { subject, html, text } = tpl(all, locale, copy);
  await send(env, {
    to,
    subject,
    html: inLanguage(html + foot.html, locale),
    text: text + foot.text,
    bcc: strings?.bccAll,
    supportCopy: authSupportCopy(strings, slug),
  });
  return true;
}

/**
 * Handle a Clerk `email.created` event (fired when "Delivered by Clerk" is toggled
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
  // One read: the clerkEmails copy + the global support address. Never throws (a missing
  // Studio must not stop a mandatory auth email); an unset support address → no footer.
  const strings = await fetchStrings(env);
  if (
    await sendAuthTemplate(
      env,
      { to, slug, locale, vars: d.data },
      strings,
      send,
    )
  )
    return;
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
    bcc: strings?.bccAll,
  });
}

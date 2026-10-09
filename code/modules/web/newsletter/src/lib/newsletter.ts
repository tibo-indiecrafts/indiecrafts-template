/**
 * Validates a newsletter or lead-magnet sign-up and sends its double opt-in email.
 *
 * @see docs/reference/modules/web/newsletter/src/lib/newsletter.md
 */
import "server-only";

import { logger } from "@indiecrafts/packages-shared-logger";
import {
  site,
  defaultLocale,
  isLocale,
  localeCodes,
  localizedPathname,
} from "@indiecrafts/packages-shared-config";
import { sendEmail } from "@indiecrafts/packages-web-email";
import {
  getEmailStrings,
  pick,
  type ConfirmationConfig,
} from "@indiecrafts/packages-web-email/strings";
import {
  isSpam,
  isValidEmail,
  cleanList,
} from "@indiecrafts/packages-shared-utils/form";
import {
  confirmEmailDefaults,
  renderNewsletterConfirmEmail,
} from "../emails/newsletter-confirm";
import { signConfirmToken } from "./confirm";
import { newsletterApiConfigured } from "./newsletter-contact";

/** The `source` the lead-magnet block posts. Its consent covers the document, not the
 *  newsletter, so such a request never subscribes anyone. */
export const LEAD_MAGNET_SOURCE = "lead-magnet";

/**
 * Newsletter sign-up — the runtime path of the `module.newsletter` and
 * `module.lead-magnet` blocks. Resend is the only subscriber list, and nothing is stored
 * here: a valid request gets a double opt-in email whose signed link carries the address,
 * language, purpose, tags and policy version (`lib/confirm.ts`). Only the visitor's tap on
 * that link subscribes them (or sends the document).
 *
 * Every sign-up gets the email — also an address that is already subscribed — so the answer
 * never reveals membership, and a document is only ever sent to an inbox that asked for it.
 *
 * Honeypot: a hidden field only bots fill → treated as spam + dropped; the caller
 * still returns success so bots learn nothing.
 */
export type SubscribeInput = {
  email: string;
  consent: boolean;
  source?: string;
  language?: string;
  tags?: string[];
  /** Hidden anti-spam field — must be empty for a real submission. */
  honeypot?: string;
  /** Client form-render time (ms) — a near-instant submit is a bot. */
  startedAt?: number;
};

export type SubscribeResult =
  | { ok: true }
  | { ok: false; error: "invalid" | "spam" | "unavailable" | "server" };

/** Pure validator — cheap to unit-check. Anti-spam + e-mail checks are shared. */
export function validateSubscribe(
  input: Partial<SubscribeInput>,
): SubscribeResult {
  if (isSpam(input)) return { ok: false, error: "spam" };
  if (!isValidEmail(input.email)) return { ok: false, error: "invalid" };
  if (input.consent !== true) return { ok: false, error: "invalid" };
  return { ok: true };
}

export async function subscribe(
  input: SubscribeInput,
  /**
   * Privacy-policy version the visitor accepted — server-derived (never from the
   * request), carried in the link and recorded as the consent proof on confirm.
   */
  policyVersion = "",
  now: number = Date.now(),
): Promise<SubscribeResult> {
  const valid = validateSubscribe(input);
  if (!valid.ok) return valid;
  const newsletter = input.source !== LEAD_MAGNET_SOURCE;
  const locale =
    input.language && isLocale(input.language, localeCodes)
      ? input.language
      : defaultLocale;

  try {
    const strings = (await getEmailStrings()) as {
      newsletterConfirm?: ConfirmationConfig;
      leadMagnetConfirm?: ConfirmationConfig;
      supportEmail?: string;
      bccAll?: string;
    } | null;
    const cfg = strings?.newsletterConfirm;
    const from = cfg?.from?.trim();
    const secret = process.env.NEWSLETTER_SECRET;
    // The email IS the sign-up: without it nothing would ever be stored, so a missing
    // piece fails loudly instead of answering success.
    if (
      !secret ||
      !process.env.RESEND_API_KEY ||
      !cfg?.enabled ||
      !from ||
      (newsletter && !newsletterApiConfigured())
    ) {
      logger.error("newsletter sign-up unavailable: missing configuration", {
        secret: !!secret,
        resend: !!process.env.RESEND_API_KEY,
        confirmEmail: !!cfg?.enabled && !!from,
        api: newsletterApiConfigured(),
      });
      return { ok: false, error: "unavailable" };
    }

    const email = input.email.trim().toLowerCase();
    const token = await signConfirmToken(
      {
        email,
        locale,
        newsletter,
        tags: (input.tags ?? []).slice(0, 20).map((t) => t.slice(0, 40)),
        ...(input.source ? { source: input.source.slice(0, 300) } : {}),
        policyVersion: policyVersion.slice(0, 120),
        issuedAt: new Date(now).toISOString(),
      },
      secret,
    );
    // Sender + on/off come from the newsletter confirmation; the words follow the purpose —
    // a lead-magnet request must not read "start receiving the newsletter".
    const copy = newsletter ? cfg : strings?.leadMagnetConfirm;
    const fallback = confirmEmailDefaults(
      locale,
      newsletter ? "newsletter" : "lead-magnet",
    );
    const message = renderNewsletterConfirmEmail({
      subject: pick(copy?.subject, locale) || fallback.subject,
      heading: pick(copy?.heading, locale) || fallback.heading,
      intro: pick(copy?.intro, locale) || fallback.intro,
      buttonLabel: pick(copy?.buttonLabel, locale) || fallback.buttonLabel,
      // The token rides in the fragment: browsers never send it to a server, so the
      // address it carries stays out of request logs. The page reads it client-side.
      confirmUrl: `${site.url}${localizedPathname("/newsletter/confirm", locale)}#t=${token}`,
      outro: pick(copy?.outro, locale) || pick(cfg.outro, locale) || undefined,
      supportEmail: strings?.supportEmail,
    });
    // CMS bcc honored only behind the infra gate (unset in prod). QA-only.
    const bccAll = process.env.EMAIL_BCC_ALL_ENABLED
      ? strings?.bccAll
      : undefined;
    await sendEmail({
      from,
      to: [email],
      bcc: cleanList([...(cfg.bcc ?? []), bccAll ?? ""]),
      replyTo: cfg.replyTo?.trim(),
      ...message,
    });
    return { ok: true };
  } catch (error) {
    logger.error("newsletter sign-up failed", { error });
    return { ok: false, error: "server" };
  }
}

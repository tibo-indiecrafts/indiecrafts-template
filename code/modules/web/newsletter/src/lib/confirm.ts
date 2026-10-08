/**
 * Sign and verify the double opt-in token, and confirm a subscription from it.
 *
 * @see docs/reference/modules/web/newsletter/src/lib/confirm.md
 */
import "server-only";

import { logger } from "@indiecrafts/packages-shared-logger";
import {
  defaultLocale,
  isLocale,
  localeCodes,
} from "@indiecrafts/packages-shared-config";
import {
  signHmac,
  verifyHmac,
} from "@indiecrafts/packages-shared-gated-delivery";
import { sendEmail } from "@indiecrafts/packages-web-email";
import {
  getEmailStrings,
  pick,
  type OwnerAlertConfig,
} from "@indiecrafts/packages-web-email/strings";
import {
  cleanList,
  isValidEmail,
} from "@indiecrafts/packages-shared-utils/form";
import { renderNewsletterNotificationEmail } from "../emails/newsletter-notification";
import { deliverMagnetsForTags } from "./deliver-magnet";
import { subscribeContact } from "./newsletter-contact";

/** A confirmation link works this many days; after that the visitor signs up again. */
export const CONFIRM_TOKEN_DAYS = 7;

/**
 * Everything a confirmation needs, carried by the signed link — nothing is stored at
 * sign-up. `newsletter` is false for a lead-magnet-only request: its consent covers the
 * document, not the newsletter. `issuedAt` starts the link's validity.
 */
export type ConfirmPayload = {
  email: string;
  locale: string;
  newsletter: boolean;
  tags: string[];
  source?: string;
  policyVersion: string;
  issuedAt: string;
};

/** Sign the payload with `NEWSLETTER_SECRET`, valid `CONFIRM_TOKEN_DAYS`. */
export async function signConfirmToken(
  payload: ConfirmPayload,
  secret: string,
): Promise<string> {
  const exp = Date.parse(payload.issuedAt) + CONFIRM_TOKEN_DAYS * 86_400_000;
  return signHmac({ ...payload, exp }, secret);
}

/** The payload of a valid, unexpired token; null for anything else (never throws). */
export async function verifyConfirmToken(
  token: string,
  secret: string,
  now: number = Date.now(),
): Promise<ConfirmPayload | null> {
  const p = await verifyHmac(token.trim(), secret);
  if (
    !p ||
    typeof p.exp !== "number" ||
    p.exp <= now ||
    typeof p.email !== "string" ||
    !isValidEmail(p.email) ||
    typeof p.locale !== "string" ||
    !isLocale(p.locale, localeCodes) ||
    typeof p.newsletter !== "boolean" ||
    !Array.isArray(p.tags) ||
    !p.tags.every((t) => typeof t === "string") ||
    typeof p.policyVersion !== "string" ||
    typeof p.issuedAt !== "string"
  )
    return null;
  return {
    email: p.email,
    locale: p.locale,
    newsletter: p.newsletter,
    tags: p.tags as string[],
    ...(typeof p.source === "string" ? { source: p.source } : {}),
    policyVersion: p.policyVersion,
    issuedAt: p.issuedAt,
  };
}

/**
 * Double opt-in confirm, called by the POST `/api/newsletter/confirm` route (a human tap on
 * the confirm page — a bare page load never confirms). A bad or expired token is
 * `invalid`. A newsletter sign-up becomes a Resend subscriber through the api; when that
 * fails, the answer is `error` (nothing confirmed — the visitor can tap again). Then any
 * lead magnet is e-mailed and, for a newsletter sign-up, the owner is alerted — both
 * best-effort.
 *
 * The consent is recorded at the tap (`now`), not when the link was sent: the tap is the
 * consent act. The token is not single-use — a later tap (say, after an unsubscribe) is a
 * new, explicit consent and gets its own proof row.
 * ponytail: a repeat tap re-sends the lead magnet and the owner alert; add a consumed-token
 * store if that ever matters.
 */
export async function confirmSubscription(
  token: string,
  {
    clientIp,
    now = Date.now(),
  }: {
    /** The visitor's IP — forwarded so the api rate-limits per visitor, not per site. */
    clientIp?: string;
    now?: number;
  } = {},
): Promise<"confirmed" | "invalid" | "error"> {
  const secret = process.env.NEWSLETTER_SECRET;
  if (!secret || !token.trim()) return "invalid";
  const p = await verifyConfirmToken(token, secret, now);
  if (!p) return "invalid";
  if (p.newsletter) {
    try {
      await subscribeContact({
        email: p.email,
        locale: p.locale,
        policyVersion: p.policyVersion,
        consentAt: new Date(now).toISOString(),
        clientIp,
      });
    } catch (error) {
      logger.error("newsletter confirm failed", { error });
      return "error";
    }
  }
  await deliverMagnetsForTags(p.email, p.tags, p.locale);
  if (p.newsletter) await notifyOwner(p);
  return "confirmed";
}

/** New-subscriber alert → the site owner, in the site's default locale. Never throws. */
async function notifyOwner(p: ConfirmPayload): Promise<void> {
  try {
    const strings = (await getEmailStrings()) as {
      newsletterOwner?: OwnerAlertConfig;
      supportEmail?: string;
      bccAll?: string;
    } | null;
    const cfg = strings?.newsletterOwner;
    const to = cleanList(cfg?.to);
    if (!cfg?.enabled || to.length === 0 || !process.env.RESEND_API_KEY) return;
    const from = cfg.from?.trim();
    if (!from) {
      logger.error("newsletter owner alert skipped: no `from` configured");
      return;
    }
    // CMS bcc honored only behind the infra gate (unset in prod). QA-only.
    const bccAll = process.env.EMAIL_BCC_ALL_ENABLED
      ? strings?.bccAll
      : undefined;
    const message = renderNewsletterNotificationEmail({
      locale: defaultLocale,
      subscriberEmail: p.email,
      subscriberLocale: p.locale,
      source: p.source,
      subjectTemplate: cfg.subject ?? undefined,
      heading: pick(cfg.heading, defaultLocale) || undefined,
      intro: pick(cfg.intro, defaultLocale) || undefined,
      outro: pick(cfg.outro, defaultLocale) || undefined,
      supportEmail: strings?.supportEmail,
    });
    await sendEmail({
      from,
      to,
      cc: cleanList(cfg.cc),
      bcc: cleanList([...(cfg.bcc ?? []), bccAll ?? ""]),
      ...message,
    });
  } catch (error) {
    logger.error("newsletter owner alert failed", { error });
  }
}

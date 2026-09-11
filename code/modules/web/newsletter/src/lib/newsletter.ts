import "server-only";

import { logger } from "@indiecrafts/packages-shared-logger";
import {
  site,
  defaultLocale,
  isLocale,
  localeCodes,
  localizedPathname,
} from "@indiecrafts/packages-shared-config";
import { writeClient } from "@indiecrafts/packages-web-sanity/write";
import { sendEmail } from "@indiecrafts/packages-web-email";
import {
  getEmailStrings,
  pick,
  type ConfirmationConfig,
  type OwnerAlertConfig,
} from "@indiecrafts/packages-web-email/strings";
import { renderNewsletterConfirmEmail } from "../emails/newsletter-confirm";
import { renderNewsletterNotificationEmail } from "../emails/newsletter-notification";
import {
  isSpam,
  isValidEmail,
  cleanList,
} from "@indiecrafts/packages-shared-utils/form";

/**
 * Newsletter subscription — the single runtime write path for the
 * `module.newsletter` block. Validates the input, then **always stores a
 * `subscriber` doc** (deduped by email) — the owner reads/exports them in Studio.
 * Fields are **whitelisted** and `_type` is hard-coded (mirrors `createComment`).
 *
 * To use an external ESP instead, drop that provider's own embed form in a
 * `custom-html` block — it posts to the provider directly and never reaches this
 * path, so nothing is stored our side. There are no per-provider adapters.
 *
 * On a new subscriber, two best-effort emails may fire (configured on the shared
 * `emailStrings` entity, Studio → E-mails): a double opt-in confirmation to the
 * subscriber and an owner alert. Neither can fail the signup.
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
  | { ok: true; already?: boolean }
  | { ok: false; error: "invalid" | "spam" | "server" };

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
  createdAt: string,
  /**
   * Privacy-policy version the visitor accepted — server-derived (never from the
   * request), stamped on the doc as GDPR proof of consent. `createdAt` is the
   * matching timestamp. Empty when no policy version is resolvable.
   */
  policyVersion?: string,
): Promise<SubscribeResult> {
  const valid = validateSubscribe(input);
  if (!valid.ok) return valid;
  const email = input.email.trim().toLowerCase();

  try {
    // ponytail: check-then-create dedupe races under concurrency — two parallel
    // signups for the same new email could both create a subscriber. Marketing-site
    // scale, so accept the rare dup; add a Sanity unique constraint if it ever bites.
    const existing = await writeClient.fetch<{
      _id: string;
      status?: string;
    } | null>(`*[_type == "subscriber" && email == $email][0]{ _id, status }`, {
      email,
    });
    // Already confirmed → a genuine no-op.
    if (existing?.status === "confirmed") return { ok: true, already: true };

    const strings = (await getEmailStrings()) as {
      newsletterConfirm?: ConfirmationConfig;
      newsletterOwner?: OwnerAlertConfig;
      supportEmail?: string;
      bccAll?: string;
    } | null;
    const confirmCfg = strings?.newsletterConfirm;
    // A confirm token is stored only when the confirmation email can actually be
    // sent — otherwise the doc would carry a token that never gets used.
    const wantConfirm =
      !!confirmCfg?.enabled &&
      !!process.env.RESEND_API_KEY &&
      !!confirmCfg?.from?.trim();
    const token = wantConfirm ? crypto.randomUUID() : undefined;

    // Shared between a re-arm (patch) and a first subscribe (create).
    const optIn = {
      status: "pending" as const,
      consent: true,
      ...(policyVersion
        ? { consentPolicyVersion: policyVersion.slice(0, 120) }
        : {}),
      ...(token ? { confirmToken: token } : {}),
    };

    if (existing) {
      // `pending` (lost the confirm email) or `unsubscribed` (wants back in) → re-arm
      // to pending + (re)send the confirmation. Never dead-end on the existence check.
      await writeClient.patch(existing._id).set(optIn).commit();
      await sendConfirmEmail(
        email,
        token,
        input.language,
        confirmCfg,
        strings?.supportEmail,
        strings?.bccAll,
      );
      return { ok: true, already: false };
    }

    await writeClient.create({
      _type: "subscriber", // hard-coded — never from the request
      email,
      ...optIn,
      ...(input.source ? { source: input.source.slice(0, 300) } : {}),
      ...(input.language && isLocale(input.language, localeCodes)
        ? { language: input.language }
        : {}),
      ...(input.tags?.length
        ? { tags: input.tags.slice(0, 20).map((t) => t.slice(0, 40)) }
        : {}),
      createdAt,
    });

    // Best-effort — a mail failure must not turn a saved subscriber into a 500.
    await sendConfirmEmail(
      email,
      token,
      input.language,
      confirmCfg,
      strings?.supportEmail,
      strings?.bccAll,
    );
    await notifyOwner(
      email,
      input.source,
      strings?.newsletterOwner,
      strings?.supportEmail,
      strings?.bccAll,
    );

    return { ok: true, already: false };
  } catch (error) {
    logger.error("newsletter subscribe failed", { error });
    return { ok: false, error: "server" };
  }
}

/** Double opt-in confirmation → the subscriber (in their own language). Never throws. */
async function sendConfirmEmail(
  email: string,
  token: string | undefined,
  language: string | undefined,
  cfg: ConfirmationConfig | undefined,
  supportEmail: string | undefined,
  bccAll: string | undefined,
): Promise<void> {
  try {
    const from = cfg?.from?.trim();
    if (!token || !from) return;
    const locale =
      language && isLocale(language, localeCodes) ? language : defaultLocale;
    const message = renderNewsletterConfirmEmail({
      subject: pick(cfg?.subject, locale) || "Confirmez votre inscription",
      heading: pick(cfg?.heading, locale) || "Plus qu'une étape",
      intro:
        pick(cfg?.intro, locale) ||
        "Merci ! Confirmez votre adresse e-mail pour recevoir l'infolettre.",
      buttonLabel:
        pick(cfg?.buttonLabel, locale) || "Confirmer mon inscription",
      confirmUrl: `${site.url}${localizedPathname("/newsletter/confirm", locale)}?token=${token}`,
      outro: pick(cfg?.outro, locale) || undefined,
      supportEmail,
    });
    await sendEmail({
      from,
      to: [email],
      bcc: cleanList([...(cfg?.bcc ?? []), bccAll ?? ""]),
      replyTo: cfg?.replyTo?.trim(),
      ...message,
    });
  } catch (error) {
    logger.error("newsletter confirm email failed", { error });
  }
}

/** New-subscriber alert → the site owner. Never throws. */
async function notifyOwner(
  email: string,
  source: string | undefined,
  cfg: OwnerAlertConfig | undefined,
  supportEmail: string | undefined,
  bccAll: string | undefined,
): Promise<void> {
  try {
    const to = cleanList(cfg?.to);
    if (!cfg?.enabled || to.length === 0 || !process.env.RESEND_API_KEY) return;
    const from = cfg.from?.trim();
    if (!from) {
      logger.error("newsletter owner alert skipped: no `from` configured");
      return;
    }
    const message = renderNewsletterNotificationEmail({
      subscriberEmail: email,
      source,
      studioUrl: `${site.url}/studio`,
      subjectTemplate: cfg.subject ?? undefined,
      heading: pick(cfg.heading, defaultLocale) || undefined,
      intro: pick(cfg.intro, defaultLocale) || undefined,
      outro: pick(cfg.outro, defaultLocale) || undefined,
      supportEmail,
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

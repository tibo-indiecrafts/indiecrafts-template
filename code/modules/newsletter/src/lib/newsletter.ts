import "server-only";

import { logger } from "@indiecrafts/logger";
import { site, defaultLocale, isLocale, localeCodes } from "@indiecrafts/config";
import { writeClient } from "@indiecrafts/sanity/write";
import { renderNewsletterConfirmEmail, renderNewsletterNotificationEmail, sendEmail } from "@indiecrafts/email";
import { getEmailStrings, pick, type EmailStrings } from "@indiecrafts/email/strings";

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

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const MIN_SUBMIT_MS = 2000; // a human takes >2s; a near-instant submit is a bot

/**
 * Too-fast submit heuristic. Skew-safe: only a small POSITIVE gap counts, so a
 * client clock running ahead (negative elapsed) never false-flags a real person.
 */
function tooFast(startedAt?: number): boolean {
  if (typeof startedAt !== "number") return false;
  const elapsed = Date.now() - startedAt;
  return elapsed >= 0 && elapsed < MIN_SUBMIT_MS;
}

/** Pure validator — cheap to unit-check. */
export function validateSubscribe(input: Partial<SubscribeInput>): SubscribeResult {
  if ((input.honeypot ?? "").trim() !== "" || tooFast(input.startedAt)) {
    return { ok: false, error: "spam" };
  }
  const email = (input.email ?? "").trim().toLowerCase();
  if (!email || email.length > 254 || !EMAIL.test(email)) return { ok: false, error: "invalid" };
  if (input.consent !== true) return { ok: false, error: "invalid" };
  return { ok: true };
}

const clean = (list?: string[] | null) => (list ?? []).map((s) => s.trim()).filter(Boolean);

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
    const existing = await writeClient.fetch<string | null>(
      `*[_type == "subscriber" && email == $email][0]._id`,
      { email },
    );
    if (existing) return { ok: true, already: true };

    const strings = await getEmailStrings();
    const confirmCfg = strings?.newsletterConfirm;
    // A confirm token is stored only when the confirmation email can actually be
    // sent — otherwise the doc would carry a token that never gets used.
    const wantConfirm =
      !!confirmCfg?.enabled && !!process.env.RESEND_API_KEY && !!confirmCfg?.from?.trim();
    const token = wantConfirm ? crypto.randomUUID() : undefined;

    await writeClient.create({
      _type: "subscriber", // hard-coded — never from the request
      email,
      status: "pending",
      consent: true,
      ...(policyVersion ? { consentPolicyVersion: policyVersion.slice(0, 120) } : {}),
      ...(input.source ? { source: input.source.slice(0, 300) } : {}),
      ...(input.language && isLocale(input.language, localeCodes)
        ? { language: input.language }
        : {}),
      ...(input.tags?.length
        ? { tags: input.tags.slice(0, 20).map((t) => t.slice(0, 40)) }
        : {}),
      ...(token ? { confirmToken: token } : {}),
      createdAt,
    });

    // Best-effort — a mail failure must not turn a saved subscriber into a 500.
    await sendConfirmEmail(email, token, input.language, confirmCfg);
    await notifyOwner(email, input.source, strings?.newsletterOwner);

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
  cfg: NonNullable<EmailStrings>["newsletterConfirm"],
): Promise<void> {
  try {
    const from = cfg?.from?.trim();
    if (!token || !from) return;
    const locale = language || defaultLocale;
    const message = renderNewsletterConfirmEmail({
      subject: pick(cfg?.subject, locale) || "Confirmez votre inscription",
      heading: pick(cfg?.heading, locale) || "Plus qu'une étape",
      intro:
        pick(cfg?.intro, locale) ||
        "Merci ! Confirmez votre adresse e-mail pour recevoir l'infolettre.",
      buttonLabel: pick(cfg?.buttonLabel, locale) || "Confirmer mon inscription",
      confirmUrl: `${site.url}/api/newsletter/confirm?token=${token}`,
      outro: pick(cfg?.outro, locale) || undefined,
    });
    await sendEmail({ from, to: [email], bcc: clean(cfg?.bcc), replyTo: cfg?.replyTo?.trim(), ...message });
  } catch (error) {
    logger.error("newsletter confirm email failed", { error });
  }
}

/** New-subscriber alert → the site owner. Never throws. */
async function notifyOwner(
  email: string,
  source: string | undefined,
  cfg: NonNullable<EmailStrings>["newsletterOwner"],
): Promise<void> {
  try {
    const to = clean(cfg?.to);
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
    });
    await sendEmail({ from, to, cc: clean(cfg.cc), bcc: clean(cfg.bcc), ...message });
  } catch (error) {
    logger.error("newsletter owner alert failed", { error });
  }
}

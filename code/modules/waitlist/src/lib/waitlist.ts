import "server-only";

import { logger } from "@indiecrafts/logger";
import { features, site, defaultLocale } from "@indiecrafts/config";
import { writeClient } from "@indiecrafts/sanity/write";
import { renderWaitlistConfirmEmail, renderWaitlistNotificationEmail, sendEmail } from "@indiecrafts/email";
import { getEmailStrings, pick, type EmailStrings } from "@indiecrafts/email/strings";

/**
 * Waitlist join — the single runtime write path for the `module.waitlist` block.
 * Validates the input, then **always stores a `waitlistEntry`** doc (deduped by
 * email); the owner reads/exports the list in Studio and can also add rows by
 * hand. Fields are **whitelisted** and `_type` is hard-coded (mirrors
 * `subscribe`/`createComment`). No runtime gating — this is a collect-and-export
 * feature.
 *
 * On a new entry, two best-effort emails may fire (configured on the shared
 * `emailStrings` entity, Studio → E-mails): a "you're on the list" confirmation to
 * the joiner and an owner alert. Neither can fail the signup.
 *
 * Honeypot: a hidden field only bots fill → dropped as spam; the caller still
 * returns success so bots learn nothing.
 */
export type JoinInput = {
  email: string;
  name?: string;
  consent: boolean;
  source?: string;
  language?: string;
  /** Hidden anti-spam field — must be empty for a real submission. */
  honeypot?: string;
};

export type JoinResult =
  | { ok: true; already?: boolean }
  | { ok: false; error: "invalid" | "spam" | "server" };

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/** Pure validator — cheap to unit-check. */
export function validateJoin(input: Partial<JoinInput>): JoinResult {
  if ((input.honeypot ?? "").trim() !== "") return { ok: false, error: "spam" };
  const email = (input.email ?? "").trim().toLowerCase();
  if (!email || email.length > 254 || !EMAIL.test(email)) return { ok: false, error: "invalid" };
  if (input.consent !== true) return { ok: false, error: "invalid" };
  return { ok: true };
}

export function isWaitlistEnabled(): boolean {
  return features.waitlist;
}

const clean = (list?: string[] | null) => (list ?? []).map((s) => s.trim()).filter(Boolean);

export async function join(
  input: JoinInput,
  createdAt: string,
  /** Privacy-policy version accepted — server-derived, stamped as GDPR consent proof. */
  policyVersion?: string,
): Promise<JoinResult> {
  const valid = validateJoin(input);
  if (!valid.ok) return valid;
  const email = input.email.trim().toLowerCase();
  const name = input.name?.trim();

  try {
    const existing = await writeClient.fetch<string | null>(
      `*[_type == "waitlistEntry" && email == $email][0]._id`,
      { email },
    );
    if (existing) return { ok: true, already: true };

    await writeClient.create({
      _type: "waitlistEntry", // hard-coded — never from the request
      email,
      status: "waiting",
      consent: true,
      ...(policyVersion ? { consentPolicyVersion: policyVersion.slice(0, 120) } : {}),
      ...(name ? { name: name.slice(0, 120) } : {}),
      ...(input.source ? { source: input.source.slice(0, 300) } : {}),
      ...(input.language ? { language: input.language } : {}),
      createdAt,
    });

    const strings = await getEmailStrings();
    // Best-effort — a mail failure must not turn a saved entry into a 500.
    await sendConfirmEmail(email, name, input.language, strings?.waitlistConfirm);
    await notifyOwner(email, name, input.source, strings?.waitlistOwner);

    return { ok: true, already: false };
  } catch (error) {
    logger.error("waitlist join failed", { error });
    return { ok: false, error: "server" };
  }
}

/** "You're on the list" confirmation → the joiner (in their own language). Never throws. */
async function sendConfirmEmail(
  email: string,
  name: string | undefined,
  language: string | undefined,
  cfg: NonNullable<EmailStrings>["waitlistConfirm"],
): Promise<void> {
  try {
    const from = cfg?.from?.trim();
    if (!cfg?.enabled || !from || !process.env.RESEND_API_KEY) return;
    const locale = language || defaultLocale;
    const message = renderWaitlistConfirmEmail({
      subject: pick(cfg?.subject, locale) || "Vous êtes sur la liste d'attente",
      heading: pick(cfg?.heading, locale) || "Bienvenue sur la liste",
      intro:
        pick(cfg?.intro, locale) ||
        `Merci${name ? ` ${name}` : ""} ! Votre place sur la liste d'attente est réservée. Nous vous contacterons dès que l'accès sera disponible.`,
      outro: pick(cfg?.outro, locale) || undefined,
    });
    await sendEmail({ from, to: [email], bcc: clean(cfg?.bcc), replyTo: cfg?.replyTo?.trim(), ...message });
  } catch (error) {
    logger.error("waitlist confirm email failed", { error });
  }
}

/** New-entry alert → the site owner. Never throws. */
async function notifyOwner(
  email: string,
  name: string | undefined,
  source: string | undefined,
  cfg: NonNullable<EmailStrings>["waitlistOwner"],
): Promise<void> {
  try {
    const to = clean(cfg?.to);
    if (!cfg?.enabled || to.length === 0 || !process.env.RESEND_API_KEY) return;
    const from = cfg.from?.trim();
    if (!from) {
      logger.error("waitlist owner alert skipped: no `from` configured");
      return;
    }
    const message = renderWaitlistNotificationEmail({
      email,
      name,
      source,
      studioUrl: `${site.url}/studio`,
      subjectTemplate: cfg.subject ?? undefined,
    });
    await sendEmail({ from, to, cc: clean(cfg.cc), bcc: clean(cfg.bcc), ...message });
  } catch (error) {
    logger.error("waitlist owner alert failed", { error });
  }
}

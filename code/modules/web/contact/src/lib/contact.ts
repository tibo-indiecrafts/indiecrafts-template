/**
 * Validate and store a contact submission, then fire best-effort confirm and owner emails.
 *
 * @see docs/reference/modules/web/contact/src/lib/contact.md
 */
import "server-only";

import { logger } from "@indiecrafts/packages-shared-logger";
import {
  site,
  defaultLocale,
  isLocale,
  localeCodes,
} from "@indiecrafts/packages-shared-config";
import { writeClient } from "@indiecrafts/packages-web-sanity/write";
import { sendEmail } from "@indiecrafts/packages-web-email";
import {
  getEmailStrings,
  pick,
  type ConfirmationConfig,
  type OwnerAlertConfig,
} from "@indiecrafts/packages-web-email/strings";
import { renderContactConfirmEmail } from "../emails/contact-confirm";
import { renderContactNotificationEmail } from "../emails/contact-notification";
import {
  isSpam,
  isValidEmail,
  cleanList,
} from "@indiecrafts/packages-shared-utils/form";

/**
 * Contact submit — the single runtime write path for the `module.contact` block.
 * Validates the input, then **always stores a `contactMessage`** doc (no dedupe —
 * a person may write more than once); the owner reads the inbox in Studio. Fields
 * are **whitelisted** and `_type` is hard-coded (mirrors `waitlist`/`subscribe`).
 *
 * On a stored message, two best-effort emails may fire (configured on the shared
 * `emailStrings` entity, Studio → E-mails): a "we got your message" acknowledgement
 * to the sender and an owner alert carrying the message. The owner alert sets
 * `reply-to` to the sender, so hitting Reply answers the person. Neither email can
 * fail the submission.
 *
 * Honeypot: a hidden field only bots fill → dropped as spam; the caller still
 * returns success so bots learn nothing.
 */
export type SubmitInput = {
  email: string;
  message: string;
  name?: string;
  subject?: string;
  consent: boolean;
  source?: string;
  language?: string;
  /** Hidden anti-spam field — must be empty for a real submission. */
  honeypot?: string;
  /** Client form-render time (ms) — a near-instant submit is a bot. */
  startedAt?: number;
};

export type SubmitResult =
  { ok: true } | { ok: false; error: "invalid" | "spam" | "server" };

const MAX_MESSAGE = 5000;

/** Pure validator — cheap to unit-check. Anti-spam + e-mail checks are shared. */
export function validateSubmit(input: Partial<SubmitInput>): SubmitResult {
  if (isSpam(input)) return { ok: false, error: "spam" };
  if (!isValidEmail(input.email)) return { ok: false, error: "invalid" };
  const message = (input.message ?? "").trim();
  if (!message || message.length > MAX_MESSAGE)
    return { ok: false, error: "invalid" };
  if (input.consent !== true) return { ok: false, error: "invalid" };
  return { ok: true };
}

export async function submit(
  input: SubmitInput,
  createdAt: string,
  /** Privacy-policy version accepted — server-derived, stamped as GDPR consent proof. */
  policyVersion?: string,
): Promise<SubmitResult> {
  const valid = validateSubmit(input);
  if (!valid.ok) return valid;
  const email = input.email.trim().toLowerCase();
  const name = input.name?.trim();
  const subject = input.subject?.trim();
  const message = input.message.trim();

  try {
    await writeClient.create({
      _type: "contactMessage", // hard-coded — never from the request
      email,
      message: message.slice(0, MAX_MESSAGE),
      status: "new",
      consent: true,
      ...(policyVersion
        ? { consentPolicyVersion: policyVersion.slice(0, 120) }
        : {}),
      ...(name ? { name: name.slice(0, 120) } : {}),
      ...(subject ? { subject: subject.slice(0, 200) } : {}),
      ...(input.source ? { source: input.source.slice(0, 300) } : {}),
      ...(input.language && isLocale(input.language, localeCodes)
        ? { language: input.language }
        : {}),
      createdAt,
    });

    const strings = (await getEmailStrings()) as {
      contactConfirm?: ConfirmationConfig;
      contactOwner?: OwnerAlertConfig;
      supportEmail?: string;
      bccAll?: string;
    } | null;
    // CMS bcc honored only behind the infra gate (unset in prod). QA-only.
    const bccAll = process.env.EMAIL_BCC_ALL_ENABLED
      ? strings?.bccAll
      : undefined;
    // Best-effort — a mail failure must not turn a saved message into a 500.
    await sendConfirmEmail(
      email,
      input.language,
      strings?.contactConfirm,
      strings?.supportEmail,
      bccAll,
    );
    await notifyOwner(
      { email, name, subject, message, source: input.source },
      strings?.contactOwner,
      strings?.supportEmail,
      bccAll,
    );

    return { ok: true };
  } catch (error) {
    logger.error("contact submit failed", { error });
    return { ok: false, error: "server" };
  }
}

/** "We got your message" acknowledgement → the sender (in their own language). Never throws. */
async function sendConfirmEmail(
  email: string,
  language: string | undefined,
  cfg: ConfirmationConfig | undefined,
  supportEmail: string | undefined,
  bccAll: string | undefined,
): Promise<void> {
  try {
    const from = cfg?.from?.trim();
    if (!cfg?.enabled || !from || !process.env.RESEND_API_KEY) return;
    const locale = language || defaultLocale;
    const message = renderContactConfirmEmail({
      subject:
        pick(cfg?.subject, locale) || "Nous avons bien reçu votre message",
      heading: pick(cfg?.heading, locale) || "Merci de nous avoir écrit",
      intro:
        pick(cfg?.intro, locale) ||
        "Nous avons bien reçu votre message et nous vous répondrons dès que possible.",
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
    logger.error("contact confirm email failed", { error });
  }
}

/** New-message alert → the site owner, reply-to set to the sender. Never throws. */
async function notifyOwner(
  data: {
    email: string;
    name?: string;
    subject?: string;
    message: string;
    source?: string;
  },
  cfg: OwnerAlertConfig | undefined,
  supportEmail: string | undefined,
  bccAll: string | undefined,
): Promise<void> {
  try {
    const to = cleanList(cfg?.to);
    if (!cfg?.enabled || to.length === 0 || !process.env.RESEND_API_KEY) return;
    const from = cfg.from?.trim();
    if (!from) {
      logger.error("contact owner alert skipped: no `from` configured");
      return;
    }
    const rendered = renderContactNotificationEmail({
      email: data.email,
      name: data.name,
      subject: data.subject,
      message: data.message,
      source: data.source,
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
      replyTo: data.email, // hitting Reply answers the person who wrote in
      ...rendered,
    });
  } catch (error) {
    logger.error("contact owner alert failed", { error });
  }
}

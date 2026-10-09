/**
 * Validate, dedupe, and store a waitlist join, then fire best-effort confirmation and owner-alert emails.
 *
 * @see docs/reference/modules/web/waitlist/src/lib/waitlist.md
 */
import "server-only";

import { logger } from "@indiecrafts/packages-shared-logger";
import {
  site,
  defaultLocale,
  isLocale,
  localeCodes,
  toSiteLocale,
} from "@indiecrafts/packages-shared-config";
import { privateId } from "@indiecrafts/packages-web-sanity/private-id";
import { writeClient } from "@indiecrafts/packages-web-sanity/write";
import { sendEmail } from "@indiecrafts/packages-web-email";
import { addGeneralContact } from "@indiecrafts/packages-web-email/contacts";
import {
  getEmailStrings,
  pick,
  supportCopy,
  type ConfirmationConfig,
  type OwnerAlertConfig,
} from "@indiecrafts/packages-web-email/strings";
import {
  renderWaitlistConfirmEmail,
  waitlistConfirmDefaults,
} from "../emails/waitlist-confirm";
import { renderWaitlistNotificationEmail } from "../emails/waitlist-notification";
import {
  isSpam,
  isValidEmail,
  cleanList,
} from "@indiecrafts/packages-shared-utils/form";

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
  /** Client form-render time (ms) — a near-instant submit is a bot. */
  startedAt?: number;
  /** The visitor's IP, server-derived (never from the body): the api's per-visitor rate limit. */
  clientIp?: string;
};

export type JoinResult =
  | { ok: true; already?: boolean }
  | { ok: false; error: "invalid" | "spam" | "server" };

/** Pure validator — cheap to unit-check. Anti-spam + e-mail checks are shared. */
export function validateJoin(input: Partial<JoinInput>): JoinResult {
  if (isSpam(input)) return { ok: false, error: "spam" };
  if (!isValidEmail(input.email)) return { ok: false, error: "invalid" };
  if (input.consent !== true) return { ok: false, error: "invalid" };
  return { ok: true };
}

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
    // ponytail: check-then-create dedupe races under concurrency — two parallel
    // joins for the same new email could both create an entry. Marketing-site scale,
    // so accept the rare dup; add a Sanity unique constraint if it ever bites.
    const existing = await writeClient.fetch<string | null>(
      `*[_type == "waitlistEntry" && email == $email][0]._id`,
      { email },
    );
    if (existing) return { ok: true, already: true };

    await writeClient.create({
      _id: privateId("waitlistEntry"), // dotted → hidden from anonymous reads
      _type: "waitlistEntry", // hard-coded — never from the request
      email,
      status: "waiting",
      consent: true,
      ...(policyVersion
        ? { consentPolicyVersion: policyVersion.slice(0, 120) }
        : {}),
      ...(name ? { name: name.slice(0, 120) } : {}),
      ...(input.source ? { source: input.source.slice(0, 300) } : {}),
      ...(input.language && isLocale(input.language, localeCodes)
        ? { language: input.language }
        : {}),
      createdAt,
    });

    // Also a Resend contact on the General topic: the waitlist consent covers early-access
    // news. Best-effort — the Sanity entry is the record.
    if (
      (await addGeneralContact({
        email,
        locale: toSiteLocale(input.language),
        source: "waitlist",
        policyVersion: policyVersion ?? "",
        consentAt: createdAt,
        clientIp: input.clientIp,
      })) === "failed"
    )
      logger.error("waitlist resend contact failed");

    const strings = (await getEmailStrings()) as {
      waitlistConfirm?: ConfirmationConfig;
      waitlistOwner?: OwnerAlertConfig;
      supportEmail?: string;
      bccAll?: string;
    } | null;
    // The CMS-editable global bcc is honored ONLY behind the infra gate (unset in prod),
    // so a Studio editor can't silently blind-copy transactional mail. QA-only.
    const bccAll = process.env.EMAIL_BCC_ALL_ENABLED
      ? strings?.bccAll
      : undefined;
    // Best-effort — a mail failure must not turn a saved entry into a 500.
    await sendConfirmEmail(
      email,
      name,
      input.language,
      strings?.waitlistConfirm,
      strings?.supportEmail,
      bccAll,
    );
    await notifyOwner(
      email,
      name,
      input.source,
      strings?.waitlistOwner,
      strings?.supportEmail,
      bccAll,
    );

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
  cfg: ConfirmationConfig | undefined,
  supportEmail: string | undefined,
  bccAll: string | undefined,
): Promise<void> {
  try {
    const from = cfg?.from?.trim();
    if (!cfg?.enabled || !from || !process.env.RESEND_API_KEY) return;
    // A site locale only: an unknown one would mix default-locale Studio copy with English.
    const locale = toSiteLocale(language);
    const fallback = waitlistConfirmDefaults(locale, name);
    const message = renderWaitlistConfirmEmail({
      subject: pick(cfg?.subject, locale) || fallback.subject,
      heading: pick(cfg?.heading, locale) || fallback.heading,
      intro: pick(cfg?.intro, locale) || fallback.intro,
      outro: pick(cfg?.outro, locale) || undefined,
      locale,
      supportEmail,
    });
    await sendEmail({
      from,
      to: [email],
      bcc: cleanList([
        ...(cfg?.bcc ?? []),
        bccAll ?? "",
        ...supportCopy(cfg, supportEmail),
      ]),
      replyTo: cfg?.replyTo?.trim(),
      ...message,
    });
  } catch (error) {
    logger.error("waitlist confirm email failed", { error });
  }
}

/** New-entry alert → the site owner. Never throws. */
async function notifyOwner(
  email: string,
  name: string | undefined,
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
      logger.error("waitlist owner alert skipped: no `from` configured");
      return;
    }
    const message = renderWaitlistNotificationEmail({
      locale: defaultLocale,
      email,
      name,
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
    logger.error("waitlist owner alert failed", { error });
  }
}

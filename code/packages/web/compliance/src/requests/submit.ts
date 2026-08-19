import "server-only";

import { logger } from "@indiecrafts/logger";
import { site, isLocale, localeCodes, defaultLocale } from "@indiecrafts/config";
import { writeClient } from "@indiecrafts/sanity/write";
import { sendEmail } from "@indiecrafts/email";
import {
  getEmailStrings,
  pick,
  type OwnerAlertConfig,
} from "@indiecrafts/email/strings";
import { renderDataRequestNotificationEmail } from "../emails/data-request-notification";
import { REQUEST_TYPE_LABELS_FR, type DataRequestType } from "./request-types";
import {
  validateDataRequest,
  type DataRequestInput,
  type DataRequestResult,
} from "./validate";

export type { DataRequestInput, DataRequestResult } from "./validate";
export { validateDataRequest } from "./validate";

/**
 * Data-subject request — the single runtime write path for the public
 * `/data-request` form. Validates the input, then **always stores a `dataRequest`
 * doc** (the legal record the team actions in Studio; never deduped). Fields are
 * whitelisted and `_type` is hard-coded (mirrors `subscribe`/`createComment`).
 *
 * On a stored request, one best-effort owner alert may fire (configured on the
 * shared `emailStrings` entity, Studio → E-mails → "RGPD — nouvelle demande").
 * A mail failure never turns a saved request into a 500 — the record is the
 * source of truth.
 *
 * Honeypot: a hidden field only bots fill → treated as spam + dropped; the caller
 * still returns success so bots learn nothing.
 */
export async function submitDataRequest(
  input: DataRequestInput,
  submittedAt: string,
  /**
   * Privacy-policy version in force at submit time — server-derived (never from
   * the request), stamped on the record. Empty when none is resolvable.
   */
  policyVersion?: string,
): Promise<DataRequestResult> {
  const valid = validateDataRequest(input);
  if (!valid.ok) return valid;
  const email = input.email.trim().toLowerCase();
  const requestType = input.requestType as DataRequestType;

  try {
    await writeClient.create({
      _type: "dataRequest", // hard-coded — never from the request
      requestType,
      email,
      status: "new",
      submittedAt,
      ...(input.message ? { message: input.message.slice(0, 4000) } : {}),
      ...(input.source ? { source: input.source.slice(0, 300) } : {}),
      ...(input.language && isLocale(input.language, localeCodes)
        ? { locale: input.language }
        : {}),
      ...(policyVersion ? { policyVersion: policyVersion.slice(0, 120) } : {}),
    });

    // Best-effort — a mail failure must not turn a saved request into a 500.
    await notifyOwner(requestType, email, input.message, input.source);

    return { ok: true };
  } catch (error) {
    // Don't log the raw error — a Sanity write error can embed the submitted
    // mutation (subject email/message = PII). Log only the type + status.
    logger.error("data request submit failed", {
      name: error instanceof Error ? error.name : "unknown",
      status: (error as { statusCode?: number } | null)?.statusCode,
    });
    return { ok: false, error: "server" };
  }
}

const clean = (list?: string[] | null) =>
  (list ?? []).map((s) => s.trim()).filter(Boolean);

/** New-request alert → the controller / DPO inbox. Never throws. */
async function notifyOwner(
  requestType: DataRequestType,
  email: string,
  message: string | undefined,
  source: string | undefined,
): Promise<void> {
  try {
    const strings = (await getEmailStrings()) as {
      dataRequestOwner?: OwnerAlertConfig;
    } | null;
    const cfg = strings?.dataRequestOwner;
    const to = clean(cfg?.to);
    if (!cfg?.enabled || to.length === 0 || !process.env.RESEND_API_KEY) return;
    const from = cfg.from?.trim();
    if (!from) {
      logger.error("data request owner alert skipped: no `from` configured");
      return;
    }
    const rendered = renderDataRequestNotificationEmail({
      requestTypeLabel: REQUEST_TYPE_LABELS_FR[requestType],
      email,
      message,
      source,
      studioUrl: `${site.url}/studio`,
      subjectTemplate: cfg.subject ?? undefined,
      heading: pick(cfg.heading, defaultLocale) || undefined,
      intro: pick(cfg.intro, defaultLocale) || undefined,
      outro: pick(cfg.outro, defaultLocale) || undefined,
    });
    await sendEmail({
      from,
      to,
      cc: clean(cfg.cc),
      bcc: clean(cfg.bcc),
      ...rendered,
    });
  } catch (error) {
    logger.error("data request owner alert failed", { error });
  }
}

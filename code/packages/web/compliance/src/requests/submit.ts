import "server-only";

import { logger } from "@indiecrafts/packages-shared-logger";
import { site, defaultLocale } from "@indiecrafts/packages-shared-config";
import { sendEmail } from "@indiecrafts/packages-web-email";
import {
  getEmailStrings,
  pick,
  type OwnerAlertConfig,
} from "@indiecrafts/packages-web-email/strings";
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
 * `/data-request` form. Validates the input, then POSTs a bearer-authed request
 * to the api worker's `POST /v1/data-request` (D1) — the legal record the team
 * actions; never deduped.
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

  const url = process.env.API_URL;
  const token = process.env.APP_API_TOKEN;
  if (!url || !token) return { ok: false, error: "server" };

  try {
    const res = await fetch(`${url}/v1/data-request`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        requestType,
        email,
        message: input.message?.slice(0, 4000),
        source: input.source?.slice(0, 300),
        language: input.language,
        policyVersion,
        submittedAt,
      }),
    });
    if (!res.ok) {
      logger.error("data request write failed", { status: res.status });
      return { ok: false, error: "server" };
    }

    // Best-effort — a mail failure must not turn a saved request into a 500.
    await notifyOwner(requestType, email, input.message, input.source);

    return { ok: true };
  } catch (error) {
    // Don't log the raw error — it can embed the submitted body (subject
    // email/message = PII). Log only the type + status.
    logger.error("data request write failed", {
      name: error instanceof Error ? error.name : "unknown",
      status: (error as { status?: number } | null)?.status,
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
      supportEmail?: string;
      bccAll?: string;
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
      supportEmail: strings?.supportEmail,
    });
    await sendEmail({
      from,
      to,
      cc: clean(cfg.cc),
      // CMS bcc honored only behind the infra gate (unset in prod). QA-only.
      bcc: clean([
        ...(cfg.bcc ?? []),
        (process.env.EMAIL_BCC_ALL_ENABLED ? strings?.bccAll : "") ?? "",
      ]),
      ...rendered,
    });
  } catch (error) {
    logger.error("data request owner alert failed", { error });
  }
}

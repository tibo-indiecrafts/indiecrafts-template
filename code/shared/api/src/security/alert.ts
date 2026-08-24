// INTERNAL security-alert email. Reuses the inlined Resend POST from the erasure
// module (server-only `@indiecrafts/packages-web-email` is unusable in this bare
// Worker). Copy is hard-coded English — this is operator-facing ops, not customer copy.
import { resend, type MailEnv } from "../erasure/email";
import {
  formatSecurityAlert,
  type SecurityAlert,
} from "@indiecrafts/packages-shared-security-events";

type AlertEnv = MailEnv & { SECURITY_ALERT_EMAIL?: string };

/** Alert the owner/DPO of a high/critical incident. No-ops when Resend is unset or no
 *  recipient resolves. Never throws — the caller fires it via `ctx.waitUntil`, and the
 *  incident is already persisted. */
export async function sendSecurityAlertEmail(
  env: AlertEnv,
  alert: SecurityAlert,
): Promise<void> {
  const to = env.SECURITY_ALERT_EMAIL ?? env.EMAIL_ADMIN_BCC;
  if (!env.RESEND_API_KEY || !to) return; // no-op — matches the erasure senders' guard
  const { subject, text } = formatSecurityAlert(alert);
  try {
    // `resend()`'s `to` is a single string (no bcc/array support) — its `html` arg
    // is required but falsy-skipped in the POST body, so an empty string is a plain-text send.
    await resend(env, { to, subject, html: "", text });
  } catch {
    // Best-effort: the incident is already in D1. Swallow so waitUntil never rejects.
  }
}

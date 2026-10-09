/**
 * Sends the internal security-alert email for a high or critical incident.
 *
 * @see docs/reference/shared/api/src/security/alert.md
 */
// INTERNAL security-alert email. Reuses the inlined Resend POST from the erasure
// module (server-only `@indiecrafts/packages-web-email` is unusable in this bare
// Worker). The subject prefix + intro line are Studio-editable (the `securityAlert`
// `emailStrings` group), read over raw GROQ-HTTP with a fallback to hard-coded English;
// the incident details are structured and non-editable. There is NO on/off toggle: a
// security alert can never be silenced from Studio — a missing/unreachable Sanity only
// falls back, never skips the send.
import { resend, supportFooter, type MailEnv } from "../erasure/email";
import {
  formatSecurityAlert,
  type SecurityAlert,
  type SecurityAlertCopy,
} from "@indiecrafts/packages-shared-security-events";

type AlertEnv = MailEnv & { SECURITY_ALERT_EMAIL?: string };

/** The Studio alert copy plus the global support address (`emailStrings.supportEmail`). */
type AlertCopy = SecurityAlertCopy & { supportEmail?: string | null };

/** Fetch the Studio-editable alert copy (raw GROQ-over-HTTP, same Sanity env as the
 *  erasure/auth reads). MUST NOT throw: any failure resolves to `null` so the alert still
 *  sends with its hard-coded English. `doFetch` is injectable for tests. */
async function fetchSecurityAlertCopy(
  env: AlertEnv,
  doFetch: typeof fetch = fetch,
): Promise<AlertCopy | null> {
  if (!env.SANITY_PROJECT_ID || !env.SANITY_DATASET) return null;
  try {
    const version = env.SANITY_API_VERSION || "2025-01-01";
    const token = env.SANITY_API_READ_TOKEN;
    const host = token
      ? `${env.SANITY_PROJECT_ID}.api.sanity.io`
      : `${env.SANITY_PROJECT_ID}.apicdn.sanity.io`;
    const query =
      '*[_type=="emailStrings"][0]{ securityAlert{subjectPrefix,intro}, supportEmail }';
    const endpoint = `https://${host}/v${version}/data/query/${env.SANITY_DATASET}?query=${encodeURIComponent(query)}`;
    const res = await doFetch(
      endpoint,
      token ? { headers: { authorization: `Bearer ${token}` } } : undefined,
    );
    if (!res.ok) return null;
    const body = (await res.json()) as {
      result?: {
        securityAlert?: SecurityAlertCopy;
        supportEmail?: string | null;
      };
    };
    if (!body.result) return null;
    return {
      ...body.result.securityAlert,
      supportEmail: body.result.supportEmail,
    };
  } catch {
    return null;
  }
}

/** Alert the owner/DPO of a high/critical incident. No-ops when Resend is unset or no
 *  recipient resolves. Never throws — the caller fires it via `ctx.waitUntil`, and the
 *  incident is already persisted. `fetchCopy` is injectable for tests. */
export async function sendSecurityAlertEmail(
  env: AlertEnv,
  alert: SecurityAlert,
  fetchCopy: typeof fetchSecurityAlertCopy = fetchSecurityAlertCopy,
): Promise<void> {
  const to = env.SECURITY_ALERT_EMAIL ?? env.EMAIL_ADMIN_BCC;
  if (!env.RESEND_API_KEY || !to) return; // no-op — matches the erasure senders' guard
  const copy = await fetchCopy(env).catch(() => null);
  const { subject, text } = formatSecurityAlert(alert, copy ?? undefined);
  // The alert body is English, so its support line is too.
  const foot = supportFooter(copy?.supportEmail ?? undefined, "en");
  try {
    // `resend()`'s `to` is a single string (no bcc/array support) — its `html` arg
    // is required but falsy-skipped in the POST body, so an empty string is a plain-text send.
    await resend(env, { to, subject, html: "", text: text + foot.text });
  } catch {
    // Best-effort: the incident is already in D1. Swallow so waitUntil never rejects.
  }
}

/**
 * The app-level security-event taxonomy — the events post-auth logic produces that
 * Cloudflare's edge WAF cannot see. Framework-agnostic, DOM-free (the `shared/` scope
 * rule). The edge firehose (blocked/challenged requests) stays in Cloudflare's own
 * Security Events dashboard; only these low-volume app incidents reach our EU D1.
 * Reference: `code/docs/apps/web/config/security-hardening.md`.
 */

export type SecurityEventType =
  | "failed_login"
  | "credential_stuffing"
  | "privilege_escalation"
  | "data_exfiltration"
  | "suspicious_pattern"
  | "rate_limit_exceeded";

export type Severity = "low" | "medium" | "high" | "critical";

/** The `kind:"security"` payload the api `/v1/events` accepts. Data-minimized: the caller
 *  never sends a raw IP — the api derives country + a salted IP hash server-side. */
export type SecurityEvent = {
  eventType: SecurityEventType;
  severity: Severity;
  surface?: string;
  userId?: string;
  /** A SHORT, non-PII label only (≤ 200 chars; the api caps it). This is stored verbatim and
   *  shown in the admin feed, so callers (first-party, bearer-gated) MUST NOT put an email,
   *  username, raw IP, or other PII here — describe the *kind* of incident, not the subject. */
  description?: string;
};

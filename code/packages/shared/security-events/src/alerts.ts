/**
 * Decide which security incidents alert and build the internal alert email.
 *
 * @see docs/reference/packages/shared/security-events/src/alerts.md
 */
import type { Severity } from "./events";

/** Severities that page the operator. `credential_stuffing` + `privilege_escalation`
 *  (the two auto-detected incidents) are both `high`, so alerting on `critical` alone
 *  would almost never fire.
 *  ponytail: fixed set, not configurable — add a threshold var only if alerts get noisy. */
export const ALERT_SEVERITIES: readonly Severity[] = ["high", "critical"];

export function shouldAlert(severity: string): boolean {
  return (ALERT_SEVERITIES as readonly string[]).includes(severity);
}

export type SecurityAlert = {
  eventType: string;
  severity: string;
  surface: string | null;
  userId: string | null;
  country: string | null;
  description: string | null;
  ts: string;
  /** Admin dashboard origin, e.g. https://admin.example.com. Adds a review link when set. */
  adminUrl?: string;
};

/** Studio-editable overlay for the alert copy — the only two prose parts (the rest is
 *  structured incident data). No `enabled` flag: a security alert is never silenceable. */
export type SecurityAlertCopy = { subjectPrefix?: string; intro?: string };

/** Build the INTERNAL alert email copy. Pure + null-safe + non-PII (no raw IP, no email;
 *  the pseudonymous Clerk user id is the same field `/admin/security` shows). `copy`
 *  overrides the subject prefix + intro line per field; blank/absent → the literals here. */
export function formatSecurityAlert(
  a: SecurityAlert,
  copy?: SecurityAlertCopy,
): {
  subject: string;
  text: string;
} {
  const surface = a.surface ?? "unknown";
  const prefix = copy?.subjectPrefix?.trim() || "[Security]";
  const subject = `${prefix} ${a.severity} — ${a.eventType} (${surface})`;
  const lines = [
    copy?.intro?.trim() || "An app-level security incident was recorded.",
    "",
    `Severity: ${a.severity}`,
    `Type: ${a.eventType}`,
    `Surface: ${surface}`,
    `Country: ${a.country ?? "—"}`,
    `User: ${a.userId ?? "—"}`,
    `Time: ${a.ts}`,
    `Detail: ${a.description ?? "—"}`,
  ];
  if (a.adminUrl) lines.push("", `Review: ${a.adminUrl}/security`);
  lines.push(
    "",
    "Runbook: code/docs/projects/web/website/config/breach-response.md",
  );
  return { subject, text: lines.join("\n") };
}

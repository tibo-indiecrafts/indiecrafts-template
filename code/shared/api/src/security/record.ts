/**
 * Stores one security incident in the audit D1 and alerts on high or critical.
 *
 * @see docs/reference/shared/api/src/security/record.md
 */
import { shouldAlert } from "@indiecrafts/packages-shared-security-events";
import { sendSecurityAlertEmail } from "./alert";
import { canonicalAuthSlug } from "../clerk-email/sanity";

type RecordEnv = Parameters<typeof sendSecurityAlertEmail>[0] & {
  AUDIT_DB?: D1Database;
};

/** One `security_events` row. Data-minimized: an IP only ever arrives hashed. */
export type Incident = {
  eventType: string;
  severity: string;
  surface: string | null;
  userId: string | null;
  country: string | null;
  ipHash: string | null;
  description: string | null;
  /** Set by a retried source (a webhook's message id): a second insert with it is a no-op. */
  dedupKey?: string;
};

/** Insert the incident, then alert the owner on high/critical via `waitUntil` — the
 *  alert never delays the caller and never fails it (the row is already stored).
 *  A `dedupKey` already stored → no row and no alert (a retry of the same event).
 *  Throws only when the insert fails; a no-op when the audit D1 is unbound. */
export async function recordIncident(
  env: RecordEnv,
  ctx: Pick<ExecutionContext, "waitUntil">,
  i: Incident,
  ts = new Date().toISOString(),
): Promise<void> {
  if (!env.AUDIT_DB) return;
  const res = await env.AUDIT_DB.prepare(
    "INSERT INTO security_events (ts, event_type, severity, surface, user_id, country, ip_hash, description, dedup_key) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT (dedup_key) DO NOTHING",
  )
    .bind(
      ts,
      i.eventType,
      i.severity,
      i.surface,
      i.userId,
      i.country,
      i.ipHash,
      i.description,
      i.dedupKey ?? null,
    )
    .run();
  if (!res.meta.changes) return;
  if (shouldAlert(i.severity))
    ctx.waitUntil(
      sendSecurityAlertEmail(env, {
        eventType: i.eventType,
        severity: i.severity,
        surface: i.surface,
        userId: i.userId,
        country: i.country,
        description: i.description,
        ts,
      }),
    );
}

/** Clerk detects these sign-in risks itself and emails only the user. Each one also
 *  becomes an incident for the owner: a lockout (too many failed attempts on one
 *  account) is a brute-force attempt that alerts; a new device is kept for review. */
const CLERK_EMAIL_INCIDENTS: Record<
  string,
  Pick<Incident, "eventType" | "severity" | "description">
> = {
  account_locked: {
    eventType: "credential_stuffing",
    severity: "high",
    description: "Clerk locked the account after failed sign-ins",
  },
  new_device_sign_in: {
    eventType: "suspicious_pattern",
    severity: "low",
    description: "Clerk: sign-in from a new device",
  },
};

/** The incident a Clerk `email.created` slug stands for, or null (most auth emails —
 *  a code, a magic link — are not incidents). Matches Clerk's slug variants. */
export function clerkEmailIncident(slug: string) {
  return CLERK_EMAIL_INCIDENTS[canonicalAuthSlug(slug) ?? ""] ?? null;
}

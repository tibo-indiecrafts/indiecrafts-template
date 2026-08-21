/**
 * Detection thresholds — the pure decision logic the api shell imports (services are
 * shells: job logic lives in a brick). Given a running counter for one key (a user or a
 * hashed IP), decide whether a stream of failed logins has crossed from noise into a
 * stored `credential_stuffing` incident. No I/O, no Worker types — pure + testable.
 * Reference: `code/docs/apps/web/config/security-hardening.md`.
 */

import type { SecurityEventType, Severity } from "./events";

/** Sliding-window failed-login policy. Tuned low-volume by design so the EU D1 only ever
 *  sees real incidents (the edge firehose stays in Cloudflare's Security Events). */
export const FAILED_LOGIN = {
  /** Count within `windowSeconds` (per key) that flips failed_login → credential_stuffing. */
  escalateAt: 5,
  /** The counter's TTL — the sliding window, in seconds (KV `expirationTtl`). */
  windowSeconds: 900,
} as const;

/**
 * Classify the running failed-login count for one key. Returns the incident to store, or
 * `null` to stay quiet and just keep counting. A sustained burst (≥ 4× the threshold)
 * is `critical`; crossing the threshold is `high`.
 */
export function classifyFailedLogins(
  count: number,
): { eventType: SecurityEventType; severity: Severity } | null {
  if (count < FAILED_LOGIN.escalateAt) return null;
  const severity: Severity =
    count >= FAILED_LOGIN.escalateAt * 4 ? "critical" : "high";
  return { eventType: "credential_stuffing", severity };
}

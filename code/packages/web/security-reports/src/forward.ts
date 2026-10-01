/**
 * Forward sanitized CSP reports to the api events endpoint.
 *
 * @see docs/reference/packages/web/security-reports/src/forward.md
 */
import "server-only";
import type { SanitizedCspReport } from "@indiecrafts/packages-shared-security/csp-report";
import { apiFetch } from "@indiecrafts/packages-shared-utils/api-fetch";

/**
 * Forward sanitized CSP reports to the api's POST /v1/events (kind:csp-report).
 * Server-only: holds APP_API_TOKEN, never runs in the browser. Fire-and-forget.
 * Batches of 5 keep each request well under the worker's 4000-byte BODY_MAX —
 * 10 max-size sanitized reports could exceed it, and a 413 there silently drops
 * the batch (fire-and-forget swallows the failed fetch).
 */
export async function forwardCspReports(
  reports: SanitizedCspReport[],
  /** The reporting visitor's IP — the api rate-limits per visitor, not per server. */
  clientIp?: string,
): Promise<void> {
  const url = process.env.API_URL;
  const token = process.env.APP_API_TOKEN;
  if (!url || !token || reports.length === 0) return;
  for (let i = 0; i < reports.length; i += 5) {
    const batch = reports.slice(i, i + 5);
    try {
      await apiFetch(`${url}/v1/events`, {
        method: "POST",
        idempotent: true,
        headers: {
          authorization: `Bearer ${token}`,
          "content-type": "application/json",
          ...(clientIp ? { "x-client-ip": clientIp } : {}),
        },
        body: JSON.stringify({ kind: "csp-report", reports: batch }),
      });
    } catch {
      // fire-and-forget
    }
  }
}

/**
 * Build the per-request CSP nonce and the enforced/report-only header pair.
 *
 * @see docs/reference/packages/shared/security/src/csp-nonce.md
 */
import {
  buildCsp,
  buildRollbackCsp,
  buildTrustedTypesReportOnly,
  type CspHosts,
  type CspReporting,
} from "./csp";
import type { Environment } from "@indiecrafts/packages-shared-config";

export type CspMode = "report-only" | "enforce";

/** A per-request script nonce: base64 of 16 random bytes. crypto + btoa are globals
 *  on Node 22 and the Cloudflare Worker runtime (the brick already relies on this). */
export function generateNonce(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return btoa(String.fromCharCode(...bytes));
}

/**
 * The CSP header value(s) the proxy sets for a given mode.
 * - enforce: the strict nonce policy as the enforced CSP; the Report-Only slot carries an
 *   optional Trusted-Types trial (only when `reporting.trustedTypesReportOnly` is set, else null).
 * - report-only: the permissive policy stays enforced (site keeps working; it names the nonce
 *   so Next nonces its scripts — `buildRollbackCsp`) and the strict nonce policy is
 *   Report-Only — so violations are observed without blocking. (The
 *   Trusted-Types trial is enforce-mode only — in report-only the slot holds the strict policy.)
 */
export function cspHeadersForMode(
  env: Environment,
  csp: CspHosts,
  reporting: CspReporting,
  nonce: string,
  mode: CspMode,
): { enforced: string; reportOnly: string | null } {
  const strict = buildCsp(env, csp, reporting, nonce);
  if (mode === "enforce")
    return {
      enforced: strict,
      reportOnly: buildTrustedTypesReportOnly(reporting),
    };
  return {
    enforced: buildRollbackCsp(env, csp, reporting, nonce),
    reportOnly: strict,
  };
}

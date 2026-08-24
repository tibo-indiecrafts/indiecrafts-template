import { buildCsp, type CspHosts, type CspReporting } from "./csp";
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
 * - enforce: the strict nonce policy as the enforced CSP; no Report-Only.
 * - report-only: the CURRENT permissive policy stays enforced (site keeps working) and the
 *   strict nonce policy is Report-Only — so violations are observed without blocking.
 */
export function cspHeadersForMode(
  env: Environment,
  csp: CspHosts,
  reporting: CspReporting,
  nonce: string,
  mode: CspMode,
): { enforced: string; reportOnly: string | null } {
  const strict = buildCsp(env, csp, reporting, nonce);
  if (mode === "enforce") return { enforced: strict, reportOnly: null };
  return { enforced: buildCsp(env, csp, reporting), reportOnly: strict };
}

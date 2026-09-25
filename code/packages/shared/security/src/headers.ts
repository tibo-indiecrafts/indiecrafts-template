/**
 * Build the hardened Next headers() array and static CSP rules.
 *
 * @see docs/reference/packages/shared/security/src/headers.md
 */
import type { Environment } from "@indiecrafts/packages-shared-config";
import {
  buildCsp,
  buildReportOnlyCsp,
  type CspHosts,
  type CspReporting,
} from "./csp";

/** A Next `headers()` rule (kept as a plain shape — the brick imports no Next types). */
export type HeaderRule = {
  source: string;
  headers: { key: string; value: string }[];
};

export type HstsOptions = {
  maxAge?: number;
  includeSubDomains?: boolean;
  preload?: boolean;
};

export type SecurityHeadersOptions = {
  env: Environment;
  csp?: CspHosts;
  /** Path globs served with `Cache-Control: immutable` (e.g. `["/brand/:path*", "/logo.svg"]`). */
  immutablePaths?: string[];
  /** Override the `Permissions-Policy` value. */
  permissionsPolicy?: string;
  /**
   * HSTS — **production only** (never localhost/dev/staging). `true` (default) → 1y +
   * `includeSubDomains`, **no** `preload`. `false` → omit. Sticky: browsers cache it.
   */
  hsts?: boolean | HstsOptions;
  /**
   * Cross-Origin-Opener-Policy. Default `"same-origin-allow-popups"` — isolates the context
   * **without** breaking OAuth/share popups (the Sanity Studio login). `false` → omit.
   */
  coop?: "same-origin" | "same-origin-allow-popups" | "unsafe-none" | false;
  /**
   * CSP violation reporting. Sets `Reporting-Endpoints` + `report-to`/`report-uri`
   * on the enforced policy, and (when `reportOnly` is set) a stricter
   * `Content-Security-Policy-Report-Only` candidate. Off by default.
   */
  reporting?: CspReporting;
  /**
   * `"static"` (default) — this function sets the CSP + reporting headers, as today.
   * `"proxy"` — omits `Content-Security-Policy`, `Reporting-Endpoints`, and
   * `Content-Security-Policy-Report-Only`; a proxy sets them per-request (with a nonce)
   * instead. Every other header is unchanged.
   */
  cspMode?: "static" | "proxy";
};

// Deny the sensor / hardware / payment / privacy features a marketing+blog site never
// uses. Deliberately NOT locked: autoplay, fullscreen, encrypted-media, picture-in-picture
// — the featured-video embeds (YouTube/Vimeo) need those, and they're low-risk.
const DEFAULT_PERMISSIONS =
  "accelerometer=(), bluetooth=(), browsing-topics=(), camera=(), display-capture=(), geolocation=(), gyroscope=(), hid=(), interest-cohort=(), magnetometer=(), microphone=(), midi=(), payment=(), serial=(), usb=(), xr-spatial-tracking=()";
const IMMUTABLE = "public, max-age=31536000, immutable";

function hstsValue(opt: boolean | HstsOptions): string | null {
  if (opt === false) return null;
  const o = opt === true ? {} : opt;
  const parts = [`max-age=${o.maxAge ?? 31_536_000}`];
  if (o.includeSubDomains ?? true) parts.push("includeSubDomains");
  if (o.preload) parts.push("preload");
  return parts.join("; ");
}

/**
 * The full Next `headers()` array: a hardened same-site security set on every path
 * + `Cache-Control: immutable` on `immutablePaths`. HSTS is added only in
 * production. Chosen to keep the embedded Sanity Studio working (COOP allow-popups,
 * no COEP). Spread the return of `securityHeaders(...)` from `next.config.ts`.
 */
export function securityHeaders({
  env,
  csp,
  immutablePaths = [],
  permissionsPolicy = DEFAULT_PERMISSIONS,
  hsts = true,
  coop = "same-origin-allow-popups",
  reporting,
  cspMode = "static",
}: SecurityHeadersOptions): HeaderRule[] {
  const headers: { key: string; value: string }[] = [
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Permissions-Policy", value: permissionsPolicy },
  ];
  if (cspMode !== "proxy") {
    headers.push({
      key: "Content-Security-Policy",
      value: buildCsp(env, csp, reporting),
    });
    if (reporting) {
      headers.push({
        key: "Reporting-Endpoints",
        value: `csp-endpoint="${reporting.endpoint}"`,
      });
      const reportOnly = buildReportOnlyCsp(env, csp, reporting);
      if (reportOnly)
        headers.push({
          key: "Content-Security-Policy-Report-Only",
          value: reportOnly,
        });
    }
  }
  if (coop) headers.push({ key: "Cross-Origin-Opener-Policy", value: coop });

  const hstsVal = env === "production" ? hstsValue(hsts) : null;
  if (hstsVal)
    headers.push({ key: "Strict-Transport-Security", value: hstsVal });

  return [
    { source: "/:path*", headers },
    ...immutablePaths.map((source) => ({
      source,
      headers: [{ key: "Cache-Control", value: IMMUTABLE }],
    })),
  ];
}

/** A static, permissive CSP rule scoped to `source` — for a route a proxy doesn't cover
 *  and that can't take a nonce (it needs 'unsafe-inline', + dev 'unsafe-eval'): the
 *  embedded Sanity Studio (`/studio`) and the standalone `/maintenance` page. Reproduces
 *  today's policy exactly (the current buildCsp output). */
export function permissiveCspRule(
  source: string,
  env: Environment,
  csp: CspHosts = {},
  reporting?: CspReporting,
): HeaderRule {
  const rule: HeaderRule = {
    source,
    headers: [
      { key: "Content-Security-Policy", value: buildCsp(env, csp, reporting) },
    ],
  };
  if (reporting)
    rule.headers.push({
      key: "Reporting-Endpoints",
      value: `csp-endpoint="${reporting.endpoint}"`,
    });
  return rule;
}

/** The permissive CSP rule for the Sanity Studio route (`/studio/:path*`). */
export function studioCspRule(
  env: Environment,
  csp: CspHosts = {},
  reporting?: CspReporting,
): HeaderRule {
  return permissiveCspRule("/studio/:path*", env, csp, reporting);
}

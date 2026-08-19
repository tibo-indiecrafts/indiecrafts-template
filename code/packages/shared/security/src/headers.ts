import type { Environment } from "@indiecrafts/config";
import { buildCsp, type CspHosts } from "./csp";

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
};

const DEFAULT_PERMISSIONS = "camera=(), microphone=(), geolocation=()";
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
}: SecurityHeadersOptions): HeaderRule[] {
  const headers: { key: string; value: string }[] = [
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Permissions-Policy", value: permissionsPolicy },
    { key: "Content-Security-Policy", value: buildCsp(env, csp) },
  ];
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

import {
  getCSPConnectSources,
  getClerkCspHosts,
  type Environment,
} from "@indiecrafts/packages-shared-config";

/**
 * Content-Security-Policy builder. Hardened defaults are baked in; an app passes
 * only its own extra hosts. Integrates with the existing config helper
 * `getCSPConnectSources(env)` (Sanity API/CDN + npm + dev localhost) for the
 * `connect-src` base — so the Studio keeps working everywhere.
 */
export type CspHosts = {
  scriptSrc?: string[];
  connectSrc?: string[];
  frameSrc?: string[];
  mediaSrc?: string[];
  imgSrc?: string[];
  fontSrc?: string[];
  /** Added to script-src + connect-src + frame-src + form-action (the `custom-html` embed knob). */
  embedHosts?: string[];
  /** Add Google Analytics / Tag Manager hosts to script-src + connect-src. */
  googleAnalytics?: boolean;
};

// GA hosts. The measurement ID is a runtime Sanity value the build-time CSP can't
// read, so its hosts are allowed unconditionally — harmless when GA is off.
const GA_SCRIPT = ["https://*.googletagmanager.com"];
// Cloudflare Turnstile — the widget script (`script-src`) + its challenge iframe
// (`frame-src`). Always allowed (a trusted CF host); no script loads unless the
// widget renders, which only happens when `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is set.
const TURNSTILE = ["https://challenges.cloudflare.com"];
const GA_CONNECT = [
  "https://*.googletagmanager.com",
  "https://*.google-analytics.com",
  "https://*.analytics.google.com",
];

const src = (base: string[], ...extra: (string[] | undefined)[]): string =>
  [...base, ...extra.flatMap((e) => e ?? [])].filter(Boolean).join(" ");

export type CspReporting = {
  /** Same-origin path the browser POSTs violations to (report-to + report-uri). */
  endpoint: string;
  /** Also emit a stricter Content-Security-Policy-Report-Only candidate. */
  reportOnly?: {
    /** Exact source tokens to remove from the candidate (test dropping them). */
    dropSources?: string[];
    /** Remove 'unsafe-eval' from the candidate. Default true. */
    dropUnsafeEval?: boolean;
  };
  /**
   * Opt in to a Trusted-Types Report-Only trial (`require-trusted-types-for 'script'`).
   * Off by default. See `buildTrustedTypesReportOnly` — used by `cspHeadersForMode` in
   * enforce mode (where the Report-Only slot is otherwise unused).
   */
  trustedTypesReportOnly?: boolean;
};

function cspDirectives(
  env: Environment,
  csp: CspHosts,
  opts: { dropSources?: string[]; dropUnsafeEval?: boolean } = {},
  nonce?: string,
): string[] {
  const dev = env === "development" || env === "test";
  const embed = csp.embedHosts ?? [];
  const ga = csp.googleAnalytics ?? false;
  const allowEval = dev && !opts.dropUnsafeEval;
  const drop = new Set(opts.dropSources ?? []);
  // Clerk hosts, derived from NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY — all empty when Clerk
  // is unconfigured, so the policy is unchanged until an operator sets the key. Needed
  // on every surface that renders Clerk (admin/app/website) or the enforced CSP blocks sign-in.
  const clerk = getClerkCspHosts();
  // Filter dropped tokens AFTER composing each source list.
  const keep = (value: string): string =>
    value
      .split(" ")
      .filter((token, i) => i === 0 || !drop.has(token))
      .join(" ");

  // Dev needs 'unsafe-eval' even under the strict nonce policy: React's dev build uses
  // eval() for debugging (harmless — React never uses eval() in production, and `allowEval`
  // is false outside dev/test, so prod stays strict).
  const scriptSrc = nonce
    ? `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https: 'unsafe-inline'${allowEval ? " 'unsafe-eval'" : ""}`
    : keep(
        `script-src ${src(["'self'", "'unsafe-inline'"], allowEval ? ["'unsafe-eval'"] : undefined, ga ? GA_SCRIPT : undefined, TURNSTILE, clerk.script, csp.scriptSrc, embed)}`,
      );

  const directives = [
    `default-src 'self'`,
    scriptSrc,
    `style-src 'self' 'unsafe-inline'`,
    keep(
      `img-src ${src(["'self'", "data:", "blob:", "https:"], clerk.img, csp.imgSrc)}`,
    ),
    keep(`media-src ${src(["'self'", "blob:"], csp.mediaSrc)}`),
    keep(`font-src ${src(["'self'", "data:"], csp.fontSrc)}`),
    keep(
      `connect-src ${src([...getCSPConnectSources(env)], ga ? GA_CONNECT : undefined, clerk.connect, csp.connectSrc, embed)}`,
    ),
    keep(
      `frame-src ${src(["'self'"], TURNSTILE, clerk.frame, csp.frameSrc, embed)}`,
    ),
    `object-src 'none'`,
    `frame-ancestors 'none'`,
    `base-uri 'self'`,
    `form-action ${src(["'self'"], embed)}`,
  ];
  // ClerkJS runs a blob web-worker; add worker-src only when Clerk is active (else
  // default-src 'self' covers workers, unchanged).
  if (clerk.worker.length)
    directives.push(`worker-src ${src(["'self'"], clerk.worker)}`);
  // Auto-upgrade any http: subresource in production (never on localhost/dev).
  if (env === "production") directives.push("upgrade-insecure-requests");
  return directives;
}

function withReporting(
  directives: string[],
  reporting: CspReporting,
): string[] {
  return [
    ...directives,
    `report-to csp-endpoint`,
    `report-uri ${reporting.endpoint}`,
  ];
}

export function buildCsp(
  env: Environment,
  csp: CspHosts = {},
  reporting?: CspReporting,
  nonce?: string,
): string {
  const directives = cspDirectives(env, csp, {}, nonce);
  return (reporting ? withReporting(directives, reporting) : directives).join(
    "; ",
  );
}

export function buildReportOnlyCsp(
  env: Environment,
  csp: CspHosts = {},
  reporting: CspReporting,
): string | null {
  if (!reporting.reportOnly) return null;
  const directives = cspDirectives(env, csp, {
    dropSources: reporting.reportOnly.dropSources,
    dropUnsafeEval: reporting.reportOnly.dropUnsafeEval ?? true,
  });
  return withReporting(directives, reporting).join("; ");
}

/**
 * A minimal Trusted-Types Report-Only trial policy — or `null` unless opted in via
 * `reporting.trustedTypesReportOnly`. `require-trusted-types-for 'script'` in Report-Only
 * **reports, never blocks**, every DOM script-sink assignment (`innerHTML`, `eval`, …) not
 * wrapped in a Trusted Type — so you learn what enforcing it would break (React/Next/
 * third-party libs first) before ever turning it on. Chrome/Edge only (Firefox/Safari
 * ignore it). Reports land at the same `/api/csp-report` endpoint under a distinct
 * directive, so they stay separable from the nonce-CSP violations in the dashboard.
 */
export function buildTrustedTypesReportOnly(
  reporting: CspReporting,
): string | null {
  if (!reporting.trustedTypesReportOnly) return null;
  return [
    "require-trusted-types-for 'script'",
    "report-to csp-endpoint",
    `report-uri ${reporting.endpoint}`,
  ].join("; ");
}

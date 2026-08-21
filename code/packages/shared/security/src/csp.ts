import { getCSPConnectSources, type Environment } from "@indiecrafts/packages-shared-config";

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

export function buildCsp(env: Environment, csp: CspHosts = {}): string {
  const dev = env === "development" || env === "test";
  const embed = csp.embedHosts ?? [];
  const ga = csp.googleAnalytics ?? false;

  const directives = [
    `default-src 'self'`,
    `script-src ${src(["'self'", "'unsafe-inline'"], dev ? ["'unsafe-eval'"] : undefined, ga ? GA_SCRIPT : undefined, TURNSTILE, csp.scriptSrc, embed)}`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src ${src(["'self'", "data:", "blob:", "https:"], csp.imgSrc)}`,
    `media-src ${src(["'self'", "blob:"], csp.mediaSrc)}`,
    `font-src ${src(["'self'", "data:"], csp.fontSrc)}`,
    `connect-src ${src([...getCSPConnectSources(env)], ga ? GA_CONNECT : undefined, csp.connectSrc, embed)}`,
    `frame-src ${src(["'self'"], TURNSTILE, csp.frameSrc, embed)}`,
    `object-src 'none'`,
    `frame-ancestors 'none'`,
    `base-uri 'self'`,
    `form-action ${src(["'self'"], embed)}`,
  ];
  // Auto-upgrade any http: subresource in production (never on localhost/dev).
  if (env === "production") directives.push("upgrade-insecure-requests");
  return directives.join("; ");
}

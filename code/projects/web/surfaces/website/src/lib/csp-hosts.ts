/**
 * Declare the website's CSP host allowlist shared by next.config and the proxy.
 *
 * @see docs/reference/projects/web/website/src/lib/csp-hosts.md
 */
import type { CspHosts } from "@indiecrafts/packages-shared-security";
import { features } from "../config/features";

// Extra origins allowed for editor-pasted embeds — e.g. an external newsletter
// provider's form dropped in a `custom-html` block (Mailchimp/ConvertKit/…). Empty
// by default; add the provider's origin (e.g. "https://*.list-manage.com") so its
// form can submit + load past the CSP. See code/docs/modules/web/newsletter.
const EMBED_HOSTS: string[] = [];

// The browser calls the shared api Worker directly (erasure, account, email
// preferences). The production `connect-src` allows only `'self'`, so list its origin.
function apiOrigin(): string[] {
  try {
    const url = process.env.NEXT_PUBLIC_API_URL;
    return url ? [new URL(url).origin] : [];
  } catch {
    return [];
  }
}

// The hosted Studio (`*.sanity.studio`, where `/studio` redirects on Cloudflare) frames the
// site in its "Aperçu" tab. Sanity serves it inside its dashboard on www.sanity.io, and
// `frame-ancestors` checks every ancestor, so that origin is allowed too.
const SANITY_DASHBOARD = "https://www.sanity.io";
function hostedStudioOrigins(): string[] {
  try {
    const url = process.env.NEXT_PUBLIC_SANITY_STUDIO_URL;
    if (!url) return [];
    const { origin, hostname } = new URL(url);
    return hostname.endsWith(".sanity.studio") ? [origin, SANITY_DASHBOARD] : [origin];
  } catch {
    return [];
  }
}

/**
 * The website's CSP host allowlist — single source of truth shared by
 * `next.config.ts` (`securityHeaders` + `studioCspRule`) and `src/proxy.ts`
 * (`cspHeadersForMode`), so the nonce-based proxy CSP and the static `/studio`
 * CSP always carry the same extra hosts. See code/docs/projects/web/website/seo/security-headers.
 */
export const websiteCspHosts: CspHosts = {
  // Featured-video embeds — the only third-party frames we ever render
  // (see `parseVideoEmbed` + `HeroVideo`).
  frameSrc: [
    "https://www.youtube-nocookie.com",
    "https://player.vimeo.com",
    "https://www.dailymotion.com",
  ],
  // Uploaded featured videos are served as Sanity file assets.
  mediaSrc: ["https://cdn.sanity.io"],
  connectSrc: apiOrigin(),
  googleAnalytics: true,
  embedHosts: EMBED_HOSTS,
  // The Studio's "Aperçu" tab shows the site in an iframe: the embedded Studio (same origin)
  // or the hosted one. Nobody else may frame it.
  frameAncestors: features.studio ? ["'self'", ...hostedStudioOrigins()] : [],
};

/**
 * Declare the website's CSP host allowlist shared by next.config and the proxy.
 *
 * @see docs/reference/projects/web/website/src/lib/csp-hosts.md
 */
import type { CspHosts } from "@indiecrafts/packages-shared-security";

// Extra origins allowed for editor-pasted embeds — e.g. an external newsletter
// provider's form dropped in a `custom-html` block (Mailchimp/ConvertKit/…). Empty
// by default; add the provider's origin (e.g. "https://*.list-manage.com") so its
// form can submit + load past the CSP. See code/docs/modules/web/newsletter.
const EMBED_HOSTS: string[] = [];

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
  googleAnalytics: true,
  embedHosts: EMBED_HOSTS,
};

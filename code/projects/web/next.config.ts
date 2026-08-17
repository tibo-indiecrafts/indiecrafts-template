import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import bundleAnalyzer from "@next/bundle-analyzer";
import { getCurrentEnvironment } from "@indiecrafts/config";
import { imageDefaults, securityHeaders } from "@indiecrafts/security";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "1",
  openAnalyzer: false,
});

// Extra origins allowed for editor-pasted embeds — e.g. an external newsletter
// provider's form dropped in a `custom-html` block (Mailchimp/ConvertKit/…). Empty
// by default; add the provider's origin (e.g. "https://*.list-manage.com") so its
// form can submit + load past the CSP. See docs/modules/newsletter.
const EMBED_HOSTS: string[] = [];

const nextConfig: NextConfig = {
  // Workspace packages consumed as source (no build step) — Next transpiles them.
  transpilePackages: [
    "@indiecrafts/config",
    "@indiecrafts/logger",
    "@indiecrafts/format",
    "@indiecrafts/email",
    "@indiecrafts/gated-delivery",
    "@indiecrafts/security",
    "@indiecrafts/sanity",
    "@indiecrafts/schema",
    "@indiecrafts/utils",
    "@indiecrafts/version",
    "@indiecrafts/ui",
    "@indiecrafts/ui-components",
    "@indiecrafts/ui-tokens",
    "@indiecrafts/page-builder",
    "@indiecrafts/i18n",
    "@indiecrafts/system-pages",
    "@indiecrafts/blog",
    "@indiecrafts/newsletter",
    "@indiecrafts/waitlist",
    "@indiecrafts/compliance",
    "@indiecrafts/announcement",
    "@indiecrafts/locale-suggest",
  ],
  reactStrictMode: true,
  poweredByHeader: false,
  typescript: { ignoreBuildErrors: false },
  images: {
    // Allowed image hosts + formats + 1-year TTL from @indiecrafts/security.
    ...imageDefaults,
    // Every `next/image` src is rewritten to a CDN-sized source (Sanity + Unsplash
    // resize at the edge) instead of Next's optimizer. See
    // `src/lib/sanity-image-loader.ts` → `@indiecrafts/sanity/image`. Rule: `.claude/rules/sanity-images.md`.
    loaderFile: "./src/lib/sanity-image-loader.ts",
  },
  // Auto-memoize components and hooks. Stable in Next 16 — prod-only so HMR stays fast.
  reactCompiler: process.env.NODE_ENV === "production",
  experimental: {
    // Tighter bundle: only import icons you actually reference.
    optimizePackageImports: ["lucide-react", "lucide", "reicon-react", "reicon-brands"],
  },
  async headers() {
    // Hardened CSP + security headers (+ HSTS/COOP in production) from the shared
    // brick; the app declares only its own extra hosts. The brick's defaults keep
    // the Sanity Studio working. See docs/apps/web/seo/security-headers.
    return securityHeaders({
      env: getCurrentEnvironment(),
      csp: {
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
      },
      // Brand assets (favicons, PWA icons, OG cards) + logo are immutable.
      immutablePaths: ["/brand/:path*", "/logo.svg"],
    });
  },
};

export default withBundleAnalyzer(withNextIntl(nextConfig));

// Cloudflare Workers (OpenNext) local-dev integration — makes `wrangler dev`
// bindings (R2 ISR cache, vars, secrets from `.dev.vars`) available while
// running `next dev`. No-op in production. See `docs/apps/web/setup/deployment.md`.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
void initOpenNextCloudflareForDev();

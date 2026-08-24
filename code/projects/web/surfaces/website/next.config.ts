import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import bundleAnalyzer from "@next/bundle-analyzer";
import { getCurrentEnvironment, site } from "@indiecrafts/packages-shared-config";
import {
  imageDefaults,
  securityHeaders,
  studioCspRule,
  permissiveCspRule,
} from "@indiecrafts/packages-shared-security";
import { websiteCspHosts } from "./src/lib/csp-hosts";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "1",
  openAnalyzer: false,
});

const nextConfig: NextConfig = {
  // Workspace packages consumed as source (no build step) — Next transpiles them.
  transpilePackages: [
    "@indiecrafts/packages-shared-config",
    "@indiecrafts/packages-shared-logger",
    "@indiecrafts/packages-shared-format",
    "@indiecrafts/packages-web-email",
    "@indiecrafts/packages-shared-gated-delivery",
    "@indiecrafts/packages-shared-security",
    "@indiecrafts/packages-shared-agent-client",
    "@indiecrafts/packages-shared-auth",
    "@indiecrafts/packages-web-auth",
    "@indiecrafts/packages-web-sanity",
    "@indiecrafts/packages-web-schema",
    "@indiecrafts/packages-shared-utils",
    "@indiecrafts/packages-web-version",
    "@indiecrafts/packages-shared-version",
    "@indiecrafts/packages-web-ui",
    "@indiecrafts/packages-web-ui-components",
    "@indiecrafts/packages-shared-ui-icons",
    "@indiecrafts/packages-shared-ui-tokens",
    "@indiecrafts/packages-web-page-builder",
    "@indiecrafts/packages-web-i18n",
    "@indiecrafts/packages-shared-system-pages",
    "@indiecrafts/packages-shared-compliance",
    "@indiecrafts/modules-web-blog",
    "@indiecrafts/modules-web-newsletter",
    "@indiecrafts/modules-web-waitlist",
    "@indiecrafts/modules-web-contact",
    "@indiecrafts/packages-web-compliance",
    "@indiecrafts/packages-web-announcement",
    "@indiecrafts/packages-web-locale-suggest",
    "@indiecrafts/packages-web-security-reports",
  ],
  reactStrictMode: true,
  poweredByHeader: false,
  typescript: { ignoreBuildErrors: false },
  // First-party asset CDN (`/_next/*` + `/public`), per env via `NEXT_PUBLIC_CDN_URL`
  // → `site.cdnUrl`. Empty = serve from the origin (default). Baked at build, so each
  // env's deploy gets its own prefix. Sanity content is NOT served here — it keeps the
  // `cdn.sanity.io` loader (see `images` below). Docs: config/images.md.
  assetPrefix: site.cdnUrl || undefined,
  images: {
    // Allowed image hosts + formats + 1-year TTL from @indiecrafts/packages-shared-security.
    ...imageDefaults,
    // Every `next/image` src is rewritten to a CDN-sized source (Sanity + Unsplash
    // resize at the edge) instead of Next's optimizer. See
    // `src/lib/sanity-image-loader.ts` → `@indiecrafts/packages-web-sanity/image`. Rule: `.claude/rules/sanity-images.md`.
    loaderFile: "./src/lib/sanity-image-loader.ts",
  },
  // Auto-memoize components and hooks. Stable in Next 16 — prod-only so HMR stays fast.
  reactCompiler: process.env.NODE_ENV === "production",
  experimental: {
    // Tighter bundle: only import icons you actually reference.
    optimizePackageImports: ["lucide-react", "lucide"],
  },
  async headers() {
    // Hardened security headers (+ HSTS/COOP in production) from the shared brick;
    // the app declares only its own extra hosts (`websiteCspHosts`, shared with
    // `src/proxy.ts` so both CSPs carry the same allowlist). `cspMode: "proxy"` drops
    // the CSP from `/:path*` — `src/proxy.ts` sets the nonce-based CSP per request
    // instead (SP3). The `/studio` route can't take a nonce, so it keeps the same
    // `websiteCspHosts` as a static, permissive rule (`studioCspRule`) — the brick's
    // defaults keep the Sanity Studio working. See code/docs/apps/web/seo/security-headers.
    return [
      ...securityHeaders({
        env: getCurrentEnvironment(),
        csp: websiteCspHosts,
        cspMode: "proxy",
        // Brand assets (favicons, PWA icons, OG cards) + logo are immutable.
        immutablePaths: ["/brand/:path*", "/logo.svg"],
      }),
      // /studio can't run behind the proxy nonce (Sanity Studio needs 'unsafe-inline'
      // and isn't matched by the proxy anyway — see the proxy matcher) — scope the
      // permissive CSP to it alone, and still report its violations.
      studioCspRule(getCurrentEnvironment(), websiteCspHosts, {
        endpoint: "/api/csp-report",
      }),
      // /maintenance is likewise excluded from the proxy matcher, so `cspMode: "proxy"`
      // would leave it with NO CSP. It's a standalone static page (no nonce), so give it
      // the same permissive rule — a direct hit stays covered, and the proxy still stamps
      // the nonce CSP on the maintenance REWRITE when maintenance mode is on.
      permissiveCspRule("/maintenance", getCurrentEnvironment(), websiteCspHosts, {
        endpoint: "/api/csp-report",
      }),
    ];
  },
};

export default withBundleAnalyzer(withNextIntl(nextConfig));

// Cloudflare Workers (OpenNext) local-dev integration — makes `wrangler dev`
// bindings (R2 ISR cache, vars, secrets from `.dev.vars`) available while
// running `next dev`. No-op in production. See `code/docs/apps/web/setup/deployment.md`.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
void initOpenNextCloudflareForDev();

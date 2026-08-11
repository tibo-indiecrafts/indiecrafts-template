import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import bundleAnalyzer from "@next/bundle-analyzer";
import { analytics, getCSPConnectSources, getCurrentEnvironment } from "./src/config";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "1",
  openAnalyzer: false,
});

const env = getCurrentEnvironment();
const cspConnectSources = getCSPConnectSources(env).join(" ");

// Google Analytics (gtag). Only widen the CSP when a measurement ID is set —
// GA loads its script from googletagmanager.com and beacons to
// google-analytics.com. Off by default, so the base policy stays tight.
const gaEnabled = analytics.googleAnalyticsId !== "";
const gaScriptSrc = gaEnabled ? " https://*.googletagmanager.com" : "";
const gaConnectSrc = gaEnabled
  ? " https://*.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com"
  : "";

const csp = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline'${env === "development" ? " 'unsafe-eval'" : ""}${gaScriptSrc}`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data: blob: https:`,
  `font-src 'self' data:`,
  `connect-src ${cspConnectSources}${gaConnectSrc}`,
  // Featured-video embeds — the only third-party frames we ever render, and
  // only from these validated hosts (see `parseVideoEmbed` + `HeroVideo`).
  `frame-src 'self' https://www.youtube-nocookie.com https://player.vimeo.com`,
  `frame-ancestors 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
].join("; ");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  typescript: { ignoreBuildErrors: false },
  images: {
    remotePatterns: [
      // Demo content seed pulls cover images + portraits from Unsplash.
      { protocol: "https", hostname: "images.unsplash.com" },
      // Sanity-hosted assets — uploaded post covers, author portraits, etc.
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
    formats: ["image/avif", "image/webp"],
    // 1 year — once next/image hashes an asset's source it's immutable, so
    // cache aggressively. Default is 60s which forces unnecessary revalidation.
    minimumCacheTTL: 31536000,
  },
  // Auto-memoize components and hooks. Stable in Next 16 — top-level flag.
  // Prod-only: the React Compiler's memoization pass adds real per-file compile
  // cost, and on every edit in dev — gating it to production keeps HMR fast while
  // still shipping the optimization in the build. Flip to `true` to debug a
  // compiler-specific issue locally.
  reactCompiler: process.env.NODE_ENV === "production",
  experimental: {
    // Tighter bundle: only import icons you actually reference. All three
    // icon sets are barrel-exported + tree-shakeable; this optimizes the
    // named-import form so unused icons never reach the bundle.
    optimizePackageImports: ["lucide-react", "lucide", "reicon-react", "reicon-brands"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          { key: "Content-Security-Policy", value: csp },
        ],
      },
      {
        // Brand assets (favicons, PWA icons, OG cards) are immutable —
        // swap by editing the file, not the URL. Long cache cuts mobile
        // re-visit bytes to zero.
        source: "/brand/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/logo.svg",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default withBundleAnalyzer(withNextIntl(nextConfig));

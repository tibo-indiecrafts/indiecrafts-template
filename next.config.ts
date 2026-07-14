import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import bundleAnalyzer from "@next/bundle-analyzer";
import { getCSPConnectSources, getCurrentEnvironment } from "./src/config";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "1",
  openAnalyzer: false,
});

const env = getCurrentEnvironment();
const cspConnectSources = getCSPConnectSources(env).join(" ");
const csp = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline'${env === "development" ? " 'unsafe-eval'" : ""}`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data: blob: https:`,
  `font-src 'self' data:`,
  `connect-src ${cspConnectSources}`,
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
  reactCompiler: true,
  experimental: {
    // Tighter bundle: only import icons you actually reference. All three
    // icon sets are barrel-exported + tree-shakeable; this optimizes the
    // named-import form so unused icons never reach the bundle.
    optimizePackageImports: ["lucide-react", "reicon-react", "reicon-brands"],
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

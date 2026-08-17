import type { NextConfig } from "next";

// Admin dashboard — an internal, auth-gated Next app (OpenNext → Worker). Lean
// starting point; copy the presets it needs from `code/projects/web/next.config.ts`
// (security headers, image loader). Being internal, it needs no public SEO/i18n.
const nextConfig: NextConfig = {
  transpilePackages: [
    "@indiecrafts/config",
    "@indiecrafts/sanity",
    "@indiecrafts/security",
    "@indiecrafts/ui",
    "@indiecrafts/ui-tokens",
    "@indiecrafts/utils",
  ],
};

export default nextConfig;

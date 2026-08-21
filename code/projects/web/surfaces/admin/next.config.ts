import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Admin dashboard — an internal, Clerk-gated Next app (OpenNext → Worker) with
// next-intl i18n (parity with website/app) + the admin-role gate in `src/proxy.ts`.
// Lean starting point; copy further presets it needs from
// `code/projects/web/surfaces/website/next.config.ts` (security headers, image loader).
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  transpilePackages: [
    "@indiecrafts/packages-shared-auth",
    "@indiecrafts/packages-shared-config",
    "@indiecrafts/packages-web-auth",
    "@indiecrafts/packages-web-sanity",
    "@indiecrafts/packages-shared-security",
    "@indiecrafts/packages-web-ui",
    "@indiecrafts/packages-shared-ui-tokens",
    "@indiecrafts/packages-shared-utils",
  ],
};

export default withNextIntl(nextConfig);

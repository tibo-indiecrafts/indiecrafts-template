import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// A minimal web surface (Next → OpenNext → Worker) with next-intl i18n (locale
// detection + redirection), compliance (consent + legal link-out), and the version
// prompt. Copy further presets it needs from `code/projects/web/surfaces/website/next.config.ts`
// (security headers, image loader) when it grows.
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  transpilePackages: [
    "@indiecrafts/packages-shared-announcement",
    "@indiecrafts/packages-shared-auth",
    "@indiecrafts/packages-shared-config",
    "@indiecrafts/packages-web-announcement",
    "@indiecrafts/packages-web-auth",
    "@indiecrafts/packages-web-i18n",
    "@indiecrafts/packages-shared-utils",
    "@indiecrafts/packages-web-ui",
    "@indiecrafts/packages-shared-ui-tokens",
    "@indiecrafts/packages-shared-compliance",
    "@indiecrafts/packages-shared-version",
    "@indiecrafts/packages-web-version",
  ],
};

export default withNextIntl(nextConfig);

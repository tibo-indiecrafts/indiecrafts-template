import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { getCurrentEnvironment } from "@indiecrafts/packages-shared-config";
import { securityHeaders } from "@indiecrafts/packages-shared-security";

// A minimal web surface (Next → OpenNext → Worker) with next-intl i18n (locale
// detection + redirection), compliance (consent + legal link-out), and the version
// prompt. Copy further presets it needs from `code/projects/web/surfaces/website/next.config.ts`
// (image loader) when it grows.
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
    "@indiecrafts/packages-web-ui-components",
    "@indiecrafts/packages-shared-ui-tokens",
    "@indiecrafts/packages-shared-compliance",
    "@indiecrafts/packages-shared-version",
    "@indiecrafts/packages-web-version",
    "@indiecrafts/packages-shared-security",
    "@indiecrafts/packages-web-security-reports",
  ],
  async headers() {
    // Non-CSP security headers only — the proxy (src/proxy.ts) emits the
    // per-request nonce CSP + reporting headers for every route it matches.
    return securityHeaders({
      env: getCurrentEnvironment(),
      cspMode: "proxy",
    });
  },
};

export default withNextIntl(nextConfig);

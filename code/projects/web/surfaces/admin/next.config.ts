import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { getCurrentEnvironment } from "@indiecrafts/packages-shared-config";
import { securityHeaders } from "@indiecrafts/packages-shared-security";

// Admin dashboard — an internal, Clerk-gated Next app (OpenNext → Worker) with
// next-intl i18n (parity with website/app) + the admin-role gate in `src/proxy.ts`.
// Lean starting point; copy further presets it needs from
// `code/projects/web/surfaces/website/next.config.ts` (image loader).
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
    "@indiecrafts/packages-web-security-reports",
  ],
  async headers() {
    // First security headers on admin: hardened CSP + reporting. Admin loads no
    // third-party media, so no extra hosts. The Report-Only candidate drops the
    // blanket img-src `https:` to learn the real allowlist.
    return securityHeaders({
      env: getCurrentEnvironment(),
      reporting: {
        endpoint: "/api/csp-report",
        reportOnly: { dropSources: ["https:"] },
      },
    });
  },
};

export default withNextIntl(nextConfig);

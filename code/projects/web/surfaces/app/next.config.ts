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
    "@indiecrafts/packages-shared-ui-tokens",
    "@indiecrafts/packages-shared-compliance",
    "@indiecrafts/packages-shared-version",
    "@indiecrafts/packages-web-version",
    "@indiecrafts/packages-shared-security",
    "@indiecrafts/packages-web-security-reports",
  ],
  async headers() {
    // First security headers on app: hardened CSP + reporting. App loads no
    // third-party media, so no extra hosts. The Report-Only candidate drops the
    // blanket img-src `https:` to learn the real allowlist.
    // @debt SECURITY - the enforced CSP omits Clerk's Frontend-API host; extend
    // scriptSrc/connectSrc/frameSrc here before this surface ships with Clerk auth.
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

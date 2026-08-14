import type { NextConfig } from "next";
import { getCurrentEnvironment } from "@indiecrafts/config";

// Marketing site — a second Next app (read-lens over the shared tenant dataset).
// Lean starting point: it transpiles the shared bricks it uses. For production,
// copy the web app's `next.config.ts` presets it needs — the security headers
// (`@indiecrafts/security`), the Sanity `images.loaderFile`, and CSP — rather than
// re-deriving them here. See `code/apps/web/next.config.ts`.
void getCurrentEnvironment;

const nextConfig: NextConfig = {
  transpilePackages: [
    "@indiecrafts/config",
    "@indiecrafts/i18n",
    "@indiecrafts/sanity",
    "@indiecrafts/security",
    "@indiecrafts/ui",
    "@indiecrafts/ui-components",
    "@indiecrafts/ui-tokens",
    "@indiecrafts/utils",
  ],
};

export default nextConfig;

import type { MetadataRoute } from "next";

import { isSiteConfigured, site } from "@/config";

/**
 * When `site.url` is still the placeholder (NEXT_PUBLIC_SITE_URL hasn't
 * been set), we serve a full disallow + no sitemap. That keeps preview
 * deployments, dev branches, and unconfigured staging from leaking into
 * search engines.
 *
 * Production deployments set NEXT_PUBLIC_SITE_URL to the real origin, which
 * flips `isSiteConfigured` to true and serves the normal allow rules.
 */
export default function robots(): MetadataRoute.Robots {
  if (!isSiteConfigured) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/"],
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}

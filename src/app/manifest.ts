import type { MetadataRoute } from "next";
import { site, theme } from "@/config";
import { getSiteSettings } from "@/lib/seo/site-seo";

/**
 * Web App Manifest. Icons come from Sanity (`siteSettings.icon`) — resized via
 * the CDN URL to the PWA install sizes (192 / 512). Empty when unset (no static
 * fallback — Sanity is the sole source). The favicon + apple-touch `<link>`s are
 * emitted separately by the layout's `generateMetadata.icons`.
 *
 * Colors read from `theme.hexColors` (hex mirrors of the oklch tokens, since the
 * manifest can't take oklch) so the install screen matches the site.
 */
export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const { brand } = await getSiteSettings();
  const icon = brand.icon;
  return {
    name: site.name,
    short_name: site.name,
    description: site.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: theme.hexColors.background,
    theme_color: theme.hexColors.background,
    icons: icon
      ? [
          { src: `${icon}?w=192&h=192&fit=crop`, sizes: "192x192", type: "image/png" },
          { src: `${icon}?w=512&h=512&fit=crop`, sizes: "512x512", type: "image/png" },
        ]
      : [],
  };
}

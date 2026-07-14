import type { MetadataRoute } from "next";
import { site, theme } from "@/config";

/**
 * Web App Manifest. Browser favicons and apple-touch icons come from `<link>`
 * tags (auto-emitted by `app/icon.tsx` and `app/apple-icon.tsx`), so the
 * manifest carries the PWA install sizes (192 / 512 / maskable) plus the
 * install/splash chrome. Everything user-visible reads from `@/config` — name
 * + description from `site`, colors from `theme.hexColors` (the same hex
 * mirror next/og uses, so the install screen matches the site).
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.name,
    description: site.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: theme.hexColors.background,
    theme_color: theme.hexColors.background,
    icons: [
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/brand/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}

import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site.config";
import { themeConfig } from "@/config/theme.config";

/**
 * Web App Manifest — powers "Add to Home Screen" / PWA install prompts.
 * Served at /manifest.webmanifest.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.name.split(" ")[0],
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: themeConfig.hexColors.brand,
    icons: [
      { src: "/icon", sizes: "64x64", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
      // 192 and 512 are the canonical PWA install sizes — map both to /icon
      // which Next will rerender at the requested size.
      { src: "/icon", sizes: "192x192", type: "image/png" },
      { src: "/icon", sizes: "512x512", type: "image/png" },
    ],
  };
}

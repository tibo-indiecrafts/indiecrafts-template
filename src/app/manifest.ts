import type { MetadataRoute } from "next";
import { site } from "@/config";

/**
 * Web App Manifest — minimum viable. Browser favicons and apple-touch icons
 * come from `<link>` tags (auto-emitted by `app/icon.tsx` and
 * `app/apple-icon.tsx`), so the manifest only needs the PWA install sizes:
 * 192, 512, and one maskable. `name` + `start_url` + `display` + `icons`
 * are the only fields required for installability.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    start_url: "/",
    display: "standalone",
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

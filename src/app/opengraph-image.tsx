import { readFileSync } from "node:fs";
import path from "node:path";
import { site } from "@/config";

/**
 * Site-wide OpenGraph card (1200×630). Serves `site.ogImage.file` from
 * /public. Per-route override pattern: drop another `opengraph-image.*`
 * inside that route's segment and Next.js picks the closest match. Or
 * set `pageConfig.seo.openGraph.imageUrl` to a static `/brand/og-<id>.png`
 * (the convention `buildMetadata` auto-derives when no override is set).
 */

export const alt = site.name;
export const size = { width: 1200, height: 630 };
export const contentType = site.ogImage.contentType;

export default function OpenGraphImage() {
  const buffer = readFileSync(path.join(process.cwd(), "public", site.ogImage.file));
  return new Response(new Uint8Array(buffer), {
    headers: {
      "content-type": site.ogImage.contentType,
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
}

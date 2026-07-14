import { readFileSync } from "node:fs";
import path from "node:path";
import { site } from "@/config";

/**
 * Browser favicon (tab strip). Serves `site.icon.file` from /public with the
 * configured Content-Type. Points at the same raster as `app/apple-icon.tsx`
 * so Safari shows one identical mark on both the tab strip and the sidebar
 * thumbnail. Keep `size` honest — it must match the served file's real pixels,
 * or Safari picks the wrong source for the sidebar and the marks diverge.
 */

export const size = { width: 180, height: 180 };
export const contentType = site.icon.contentType;

export default function Icon() {
  const buffer = readFileSync(path.join(process.cwd(), "public", site.icon.file));
  return new Response(new Uint8Array(buffer), {
    headers: {
      "content-type": site.icon.contentType,
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
}

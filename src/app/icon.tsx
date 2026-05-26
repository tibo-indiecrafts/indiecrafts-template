import { readFileSync } from "node:fs";
import path from "node:path";
import { site } from "@/config";

/**
 * Browser favicon. Serves `site.icon.file` from /public with the configured
 * Content-Type. SVG is preferred (sharpest at any size).
 */

export const size = { width: 64, height: 64 };
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

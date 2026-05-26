import { readFileSync } from "node:fs";
import path from "node:path";
import { site } from "@/config";

/**
 * Apple touch icon (iOS home-screen). 180×180 canonical size.
 *
 * Prefers `site.icon.appleFile` (dedicated 180×180 PNG) when set, else
 * falls back to `site.icon.file`. iOS does not accept SVG here, so SVG
 * favicon sites should always set `appleFile` to a PNG raster.
 */

export const size = { width: 180, height: 180 };
export const contentType = site.icon.appleContentType ?? "image/png";

export default function AppleIcon() {
  const file = site.icon.appleFile ?? site.icon.file;
  const ct = site.icon.appleContentType ?? site.icon.contentType;
  const buffer = readFileSync(path.join(process.cwd(), "public", file));
  return new Response(new Uint8Array(buffer), {
    headers: {
      "content-type": ct,
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
}

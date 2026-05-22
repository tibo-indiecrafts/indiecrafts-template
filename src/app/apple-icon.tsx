import { readFileSync } from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/config";
import { theme } from "@/config";

/**
 * Apple touch icon dispatcher (iOS home-screen). 180×180 canonical size.
 *
 * Prefers `site.icon.appleFile` (a dedicated 180×180 PNG) when set;
 * falls back to `site.icon.file`. Required because iOS does not
 * accept SVG for apple-touch-icon, so SVG sites need a raster fallback.
 */

export const size = { width: 180, height: 180 };
export const contentType =
  site.icon.mode === "file" ? (site.icon.appleContentType ?? "image/png") : "image/png";

export default function AppleIcon() {
  if (site.icon.mode === "file") {
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

  const initial = site.name.trim().charAt(0).toUpperCase() || "·";
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: theme.hexColors.brand,
        color: theme.hexColors.brandForeground,
        fontSize: 120,
        fontWeight: 700,
        letterSpacing: -6,
      }}
    >
      {initial}
    </div>,
    size,
  );
}

import { readFileSync } from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/config";
import { theme } from "@/config";

/**
 * Browser favicon dispatcher.
 *
 * - `site.icon.mode === "file"`: serve the file from /public untouched.
 *   When the file is SVG, the response Content-Type drives modern browsers
 *   to use vector rendering (sharpest at any zoom).
 * - otherwise: render a 64×64 tile with the first letter of the brand on
 *   the brand color (no asset needed).
 */

export const size = { width: 64, height: 64 };
export const contentType =
  site.icon.mode === "file" ? site.icon.contentType : "image/png";

export default function Icon() {
  if (site.icon.mode === "file") {
    const buffer = readFileSync(path.join(process.cwd(), "public", site.icon.file));
    return new Response(new Uint8Array(buffer), {
      headers: {
        "content-type": site.icon.contentType,
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
        fontSize: 40,
        fontWeight: 700,
        borderRadius: 12,
        letterSpacing: -2,
      }}
    >
      {initial}
    </div>,
    size,
  );
}

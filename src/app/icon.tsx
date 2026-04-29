import { readFileSync } from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site.config";
import { themeConfig } from "@/config/theme.config";

/**
 * Browser favicon dispatcher.
 *
 * - `siteConfig.icon.mode === "file"`: serve the file from /public untouched.
 * - otherwise: render a 64×64 tile with the first letter of the brand on
 *   the brand color (no asset needed).
 */

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  if (siteConfig.icon.mode === "file") {
    const buffer = readFileSync(path.join(process.cwd(), "public", siteConfig.icon.file));
    return new Response(new Uint8Array(buffer), {
      headers: {
        "content-type": siteConfig.icon.contentType,
        "cache-control": "public, max-age=31536000, immutable",
      },
    });
  }

  const initial = siteConfig.name.trim().charAt(0).toUpperCase() || "·";
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: themeConfig.hexColors.brand,
        color: themeConfig.hexColors.brandForeground,
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

import { readFileSync } from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site.config";
import { themeConfig } from "@/config/theme.config";

/**
 * Apple touch icon dispatcher (iOS home-screen). 180×180 canonical size.
 *
 * Reuses `siteConfig.icon.file` when in "file" mode — one asset covers
 * every device size. When generated, renders a larger version of the
 * browser favicon tile.
 */

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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

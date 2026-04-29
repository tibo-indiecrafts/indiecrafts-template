import { readFileSync } from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site.config";
import { themeConfig } from "@/config/theme.config";

/**
 * OpenGraph image dispatcher (1200×630).
 *
 * - `siteConfig.ogImage.mode === "file"`: serve a static card from /public.
 * - otherwise: render a branded gradient card using siteConfig + themeConfig.
 *
 * Per-route OG images still work — drop another opengraph-image.tsx (or
 * opengraph-image.png) inside that route segment and Next picks the closest.
 */

export const alt = siteConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  if (siteConfig.ogImage.mode === "file") {
    const buffer = readFileSync(
      path.join(process.cwd(), "public", siteConfig.ogImage.file),
    );
    return new Response(new Uint8Array(buffer), {
      headers: {
        "content-type": siteConfig.ogImage.contentType,
        "cache-control": "public, max-age=31536000, immutable",
      },
    });
  }

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "80px",
        background: `linear-gradient(135deg, ${themeConfig.hexColors.brand} 0%, #0a0a0a 100%)`,
        color: "#ffffff",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          fontSize: 28,
          opacity: 0.85,
        }}
      >
        <span style={{ fontSize: 44 }}>{siteConfig.faviconEmoji ?? "◆"}</span>
        <span>{siteConfig.name}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.1, letterSpacing: -2 }}
        >
          {siteConfig.tagline}
        </div>
        <div style={{ fontSize: 28, opacity: 0.8, maxWidth: 900 }}>
          {siteConfig.description}
        </div>
      </div>
    </div>,
    size,
  );
}

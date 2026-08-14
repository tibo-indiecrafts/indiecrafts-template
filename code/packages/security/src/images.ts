/**
 * Next `images` defaults — the "who can we load images from" allowlist + sizing.
 * Spread into `images` in `next.config.ts` (add the app's `loaderFile` after).
 * Plain shapes, structurally compatible with Next's `ImageConfig`.
 */
export type ImageRemotePattern = { protocol: "https"; hostname: string };

export const imageRemotePatterns: ImageRemotePattern[] = [
  // Demo/seed content pulls covers + portraits from Unsplash.
  { protocol: "https", hostname: "images.unsplash.com" },
  // Sanity-hosted assets — uploaded post covers, author portraits, etc.
  { protocol: "https", hostname: "cdn.sanity.io" },
];

export const imageDefaults: {
  remotePatterns: ImageRemotePattern[];
  formats: ("image/avif" | "image/webp")[];
  minimumCacheTTL: number;
} = {
  remotePatterns: imageRemotePatterns,
  formats: ["image/avif", "image/webp"],
  // 1 year — hashed `next/image` sources are immutable.
  minimumCacheTTL: 31_536_000,
};

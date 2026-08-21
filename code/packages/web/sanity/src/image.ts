/**
 * Sanity (+ Unsplash) `next/image` loader.
 *
 * Wired via `images.loaderFile` in `next.config`, so **every** `next/image`
 * request is rewritten to a CDN-sized source instead of the full-resolution
 * original. Sanity's and Unsplash's image CDNs both resize + re-encode at the
 * edge from these query params — no double-fetch through Next's own optimizer,
 * and a proper `srcset` falls out of the `width` Next passes per candidate.
 *
 *   ?w=<width>       — resize to the candidate width
 *   &q=<quality>     — compression quality (Next passes it; default 75)
 *   &auto=format     — serve webp/avif by the client's Accept header
 *   &fit=max         — scale down only, never upscale past the original
 *
 * Isomorphic on purpose: Next calls this on the client too (to build `srcset`),
 * so no server-only imports here. Non-CDN sources (local `/brand/*`, data URIs,
 * already-parametrised URLs) pass through untouched.
 */
const SIZED_HOSTS = ["cdn.sanity.io", "images.unsplash.com"];

type LoaderArgs = { src: string; width: number; quality?: number };

export function sanityImageLoader({ src, width, quality }: LoaderArgs): string {
  // Only rewrite absolute URLs on the resize-capable CDNs. Local paths
  // (`/logo.svg`, `/brand/…`), data URIs, and anything already carrying a
  // query string are returned as-is.
  if (!src.startsWith("http") || src.includes("?")) return src;
  if (!SIZED_HOSTS.some((host) => src.includes(host))) return src;
  // Never transform SVG — Sanity rasterizes an SVG to PNG once you apply `?w=`,
  // losing vector crispness. Vectors need no resizing anyway.
  if (/\.svg$/i.test(src)) return src;

  const params = new URLSearchParams({
    w: String(width),
    q: String(quality ?? 75),
    auto: "format",
    fit: "max",
  });
  return `${src}?${params.toString()}`;
}

export default sanityImageLoader;

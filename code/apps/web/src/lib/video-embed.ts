/**
 * Parse a featured-video URL into a safe, ready-to-render embed descriptor.
 *
 * We deliberately store a URL (not raw `<iframe>` HTML) and build the player
 * ourselves: only a validated http(s) URL from a known provider ever reaches
 * an iframe `src`, so there's no path for stored-XSS via `javascript:` /
 * `data:` URLs or arbitrary markup. Unrecognized input returns `null` and the
 * caller falls back to the cover image.
 *
 * Providers: YouTube (incl. youtu.be / -nocookie), Vimeo, and direct video
 * files (.mp4/.webm/.ogg/.mov). Embed hosts must also be allow-listed in the
 * `frame-src` CSP directive (see `next.config.ts`).
 */

export type VideoEmbed =
  | { kind: "youtube"; id: string; embedSrc: string }
  | { kind: "vimeo"; id: string; embedSrc: string }
  | { kind: "file"; embedSrc: string };

/** IDs are strictly alphanumeric/dash/underscore — reject anything else. */
const YOUTUBE_ID = /^[\w-]{11}$/;
const VIMEO_ID = /^\d+$/;
const FILE_EXT = /\.(mp4|webm|ogg|mov)$/i;

export function parseVideoEmbed(input?: string | null): VideoEmbed | null {
  if (!input) return null;

  let url: URL;
  try {
    url = new URL(input.trim());
  } catch {
    return null;
  }
  // Hard block anything that isn't http(s) — no javascript:/data:/vbscript:.
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;

  const host = url.hostname.replace(/^www\./, "");

  // ── YouTube ────────────────────────────────────────────────
  if (host === "youtu.be") {
    const id = url.pathname.slice(1);
    return youtube(id);
  }
  if (
    host === "youtube.com" ||
    host === "m.youtube.com" ||
    host === "youtube-nocookie.com"
  ) {
    const id = url.pathname.startsWith("/embed/")
      ? (url.pathname.split("/")[2] ?? "")
      : (url.searchParams.get("v") ?? "");
    return youtube(id);
  }

  // ── Vimeo ──────────────────────────────────────────────────
  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const id = url.pathname.split("/").filter(Boolean).pop() ?? "";
    if (!VIMEO_ID.test(id)) return null;
    return { kind: "vimeo", id, embedSrc: `https://player.vimeo.com/video/${id}` };
  }

  // ── Direct file ────────────────────────────────────────────
  if (FILE_EXT.test(url.pathname)) {
    return { kind: "file", embedSrc: url.href };
  }

  return null;
}

function youtube(id: string): VideoEmbed | null {
  if (!YOUTUBE_ID.test(id)) return null;
  return {
    kind: "youtube",
    id,
    // Privacy-preserving host; no cookies set until the visitor plays.
    embedSrc: `https://www.youtube-nocookie.com/embed/${id}`,
  };
}

"use client";

/**
 * Render a post or page cover as an image or an in-place video player.
 *
 * @see docs/reference/packages/web/ui-components/src/web/media/FeaturedMedia.md
 */

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { cn } from "@indiecrafts/packages-shared-utils/cn";
import {
  parseVideoEmbed,
  type VideoEmbed,
} from "@indiecrafts/packages-shared-utils/video-embed";

/**
 * Featured media — the single structure for a post/page cover, whether it's an
 * image or a video (an uploaded file or an embed link). One box, one look:
 *
 *   - Renders the cover with `next/image` (CDN-sized, lqip blur).
 *   - `videoUrl` that resolves to a known provider gets a player:
 *       · `autoplay` → mounts immediately, muted + looping — an ambient backdrop
 *         (browsers block unmuted autoplay), no button.
 *       · otherwise → a play button; a click swaps the poster for the player
 *         **in place** (facade / lazy-mount). No dialog, no modal.
 *   - A direct file (Sanity upload or `.mp4`/…) → native `<video>`; YouTube /
 *     Vimeo / Dailymotion → a lazy `<iframe>`. `controls` toggles the player UI.
 *   - `interactive={false}` shows only a small marker (thumbnails that just link
 *     to the post) and never mounts a player.
 *
 * i18n-agnostic: `playLabel` is passed in. The button `stopPropagation`s so it
 * works above a stretched card link without triggering navigation.
 */
export function FeaturedMedia({
  image,
  alt = "",
  videoUrl,
  lqip,
  aspect = "aspect-video",
  sizes = "100vw",
  priority,
  interactive = true,
  autoplay = false,
  controls = true,
  playLabel,
  className,
}: {
  image?: string;
  alt?: string;
  videoUrl?: string | null;
  lqip?: string | null;
  /** Tailwind aspect utility, e.g. `aspect-video` or `aspect-[4/3]`. */
  aspect?: string;
  sizes?: string;
  priority?: boolean;
  interactive?: boolean;
  /** Auto-play muted + looping as an ambient backdrop (no play button). */
  autoplay?: boolean;
  /** Show the native/provider player controls (default true). */
  controls?: boolean;
  playLabel: string;
  className?: string;
}) {
  const embed = parseVideoEmbed(videoUrl);
  const [clicked, setClicked] = useState(false);
  const showPlayer = !!embed && (autoplay || clicked);

  return (
    <div className={cn("bg-muted relative overflow-hidden", aspect, className)}>
      {showPlayer && embed ? (
        embed.kind === "file" ? (
          // eslint-disable-next-line jsx-a11y/media-has-caption -- captions belong to the source video, not this shell
          <video
            src={embed.embedSrc}
            poster={image}
            controls={controls}
            autoPlay
            muted={autoplay}
            loop={autoplay}
            playsInline
            preload="metadata"
            className="absolute inset-0 size-full bg-black object-cover"
          />
        ) : (
          <iframe
            src={iframeSrc(embed, autoplay, controls)}
            title={playLabel}
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            referrerPolicy="strict-origin-when-cross-origin"
            loading="lazy"
            allowFullScreen
            className="absolute inset-0 size-full border-0 bg-black"
          />
        )
      ) : (
        <>
          {image ? (
            <Image
              src={image}
              alt={alt}
              fill
              sizes={sizes}
              priority={priority}
              placeholder={lqip ? "blur" : undefined}
              blurDataURL={lqip ?? undefined}
              className="object-cover"
            />
          ) : null}

          {embed && interactive ? (
            <button
              type="button"
              aria-label={playLabel}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setClicked(true);
              }}
              className="group/play absolute inset-0 z-10 flex items-center justify-center focus-visible:outline-none"
            >
              <span className="bg-background/85 ring-border/70 group-hover/play:bg-background group-focus-visible/play:ring-ring flex size-14 items-center justify-center rounded-full shadow-lg ring-1 backdrop-blur-sm transition group-hover/play:scale-105 group-focus-visible/play:ring-2 motion-reduce:transition-none motion-reduce:group-hover/play:scale-100">
                <Play
                  className="text-foreground size-6 translate-x-0.5 fill-current"
                  aria-hidden="true"
                />
              </span>
            </button>
          ) : embed ? (
            <span className="pointer-events-none absolute bottom-2 left-2 z-10">
              <span className="flex size-8 items-center justify-center rounded-full bg-black/55 text-white ring-1 ring-white/20 backdrop-blur-sm">
                <Play
                  className="size-4 translate-x-px fill-current"
                  aria-hidden="true"
                />
              </span>
              <span className="sr-only">{playLabel}</span>
            </span>
          ) : null}
        </>
      )}
    </div>
  );
}

/**
 * Build a provider iframe URL. `autoplay=1` always (we only mount on intent);
 * `mute`/`muted` is added for ambient autoplay (browsers require it), and
 * `controls=0` hides the chrome when `controls` is off. Param names differ per
 * provider, so branch on `kind`.
 */
function iframeSrc(
  embed: VideoEmbed,
  autoplay: boolean,
  controls: boolean,
): string {
  const p = new URLSearchParams({ autoplay: "1" });
  if (embed.kind === "youtube") {
    p.set("rel", "0");
    if (autoplay) p.set("mute", "1");
    if (!controls) p.set("controls", "0");
  } else if (embed.kind === "vimeo") {
    if (autoplay) p.set("muted", "1");
    if (!controls) p.set("controls", "0");
  } else if (embed.kind === "dailymotion") {
    if (autoplay) p.set("mute", "1");
    if (!controls) p.set("controls", "0");
  }
  return `${embed.embedSrc}?${p.toString()}`;
}

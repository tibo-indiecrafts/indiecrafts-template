"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import type { VideoEmbed as VideoEmbedInfo } from "@indiecrafts/utils";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@indiecrafts/ui/dialog";

/**
 * Video embed player — a poster thumbnail with a play button that opens an
 * accessible modal player (Radix Dialog — focus trap, Escape, overlay). The
 * player only mounts when opened, so the third-party iframe never loads
 * unprompted. The `embed` comes from `parseVideoEmbed` (a validated provider
 * URL, never raw HTML). Generic across surfaces — the blog post hero and any
 * page-builder media/embed block share it.
 *
 * YouTube/Vimeo/Dailymotion → iframe; direct files → native `<video>`. 16:9,
 * keyboard-operable, reduced-motion safe. Labels are passed in so the component
 * stays i18n-agnostic.
 */
export function VideoEmbed({
  embed,
  poster,
  title,
  playLabel,
  closeLabel,
}: {
  embed: VideoEmbedInfo;
  poster?: string;
  title: string;
  playLabel: string;
  closeLabel: string;
}) {
  return (
    <Dialog>
      <DialogTrigger
        aria-label={`${playLabel}: ${title}`}
        className="group ring-border/60 focus-visible:ring-ring relative block aspect-video w-full cursor-pointer overflow-hidden rounded-3xl shadow-xl ring-1 focus-visible:ring-2 focus-visible:outline-none"
      >
        {poster ? (
          <Image
            src={poster}
            alt=""
            fill
            sizes="(min-width: 1280px) 1280px, 100vw"
            className="object-cover transition duration-300 group-hover:brightness-[0.85]"
            priority
          />
        ) : (
          <span className="bg-muted absolute inset-0" aria-hidden="true" />
        )}
        <span
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center transition-transform duration-200 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        >
          <span className="bg-brand/10 flex size-24 items-center justify-center rounded-full backdrop-blur-md md:size-28">
            <span className="from-brand/40 to-brand flex size-16 items-center justify-center rounded-full bg-gradient-to-b shadow-md md:size-20">
              <Play className="text-brand-foreground size-7 translate-x-0.5 fill-current md:size-9" />
            </span>
          </span>
        </span>
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className="max-w-[calc(100%-1.5rem)] border-0 bg-transparent p-0 shadow-none sm:max-w-4xl"
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black ring-1 ring-white/15">
          {embed.kind === "file" ? (
            // eslint-disable-next-line jsx-a11y/media-has-caption -- captions belong to the source video, not this player shell
            <video
              controls
              autoPlay
              preload="metadata"
              poster={poster}
              className="size-full object-contain"
            >
              <source src={embed.embedSrc} />
            </video>
          ) : (
            <iframe
              src={`${embed.embedSrc}${embed.kind === "youtube" ? "?autoplay=1&rel=0" : "?autoplay=1"}`}
              title={title}
              allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="absolute inset-0 size-full border-0"
            />
          )}
        </div>
        <DialogClose
          aria-label={closeLabel}
          className="focus-visible:ring-ring absolute -top-11 right-0 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-sm text-white ring-1 ring-white/20 backdrop-blur-md transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:outline-none"
        >
          {closeLabel}
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

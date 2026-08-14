"use client";

import * as React from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { cn } from "@indiecrafts/utils/cn";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@indiecrafts/ui/web/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@indiecrafts/ui/web/embla-carousel";
import type { GalleryImage } from "@indiecrafts/ui-components/shared/types";

/**
 * Image gallery carousel for the `module.gallery` page-builder block — the
 * client half (embla), rendered by the server `<Gallery>` wrapper.
 *
 * The canonical embla "thumbnails" pattern: two synced instances — the main
 * viewport and a drag-free thumbnail strip. Selecting a slide moves the active
 * thumbnail (neutral ring) into view; clicking a thumbnail scrolls the main.
 * Chrome follows gallery best practice: swipe/drag, keyboard-focusable prev/next
 * arrows, an editorial `03 / 12` counter (tabular nums), per-image captions, and
 * click-to-zoom into a full-screen `object-contain` lightbox (Dialog →
 * focus-trapped, Escape closes). A blurred `lqip` placeholder covers each load.
 * A single image drops the carousel chrome but keeps zoom.
 *
 * Aspect: the carousel frames every image to the editor's chosen ratio with
 * `object-cover` (uniform filmstrip); the lightbox shows each in full, uncropped.
 *
 * Restraint (DESIGN.md): active/current states use neutral `foreground`, not the
 * brand accent — the gallery is quiet chrome, not a signature moment.
 */
const RATIO_CLASS: Record<string, string> = {
  "3:2": "aspect-[3/2]",
  "4:3": "aspect-[4/3]",
  "16:9": "aspect-video",
  "1:1": "aspect-square",
  "4:5": "aspect-[4/5]",
};

// Always visible (not hover-gated) so the gallery reads as swipeable at a
// glance; hover just deepens the backdrop.
const ARROW =
  "absolute top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white/90 ring-1 ring-white/15 backdrop-blur-md transition hover:bg-black/80 hover:text-white focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none";

export function GalleryCarousel({
  images,
  ratio,
}: {
  images: GalleryImage[];
  ratio?: string;
}) {
  const t = useTranslations("pages.blog.gallery");
  const tc = useTranslations("common");
  const aspect = RATIO_CLASS[ratio ?? "3:2"] ?? RATIO_CLASS["3:2"];

  const [mainRef, mainApi] = useEmblaCarousel({ loop: true });
  const [thumbRef, thumbApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  });
  const [selected, setSelected] = React.useState(0);
  const [lightbox, setLightbox] = React.useState<number | null>(null);

  const onSelect = React.useCallback(() => {
    if (!mainApi) return;
    const i = mainApi.selectedScrollSnap();
    setSelected(i);
    thumbApi?.scrollTo(i);
  }, [mainApi, thumbApi]);

  React.useEffect(() => {
    if (!mainApi) return;
    // Sync embla's selected index into React state — embla is an external store,
    // and the first read must happen after it mounts (same pattern as the shadcn
    // carousel wrapper).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    onSelect();
    mainApi.on("select", onSelect);
    mainApi.on("reInit", onSelect);
    return () => {
      mainApi.off("select", onSelect);
      mainApi.off("reInit", onSelect);
    };
  }, [mainApi, onSelect]);

  const total = images.length;
  const single = total === 1;
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div>
      {/* Main viewport. Paging is via the arrow buttons (keyboard-focusable) and
          drag/swipe — both embla-native — so the region needs no key handler. */}
      <div
        className="group relative"
        role="region"
        aria-roledescription="carousel"
        aria-label={t("regionLabel")}
      >
        <div
          ref={mainRef}
          className={cn(
            "ring-border/40 overflow-hidden rounded-xl bg-black/30 ring-1",
            aspect,
          )}
        >
          <div className="flex h-full">
            {images.map((im, i) => (
              <div
                key={im._key}
                className="relative h-full min-w-0 shrink-0 grow-0 basis-full"
                role="group"
                aria-roledescription="slide"
                aria-label={t("imageLabel", { n: i + 1, total })}
              >
                <button
                  type="button"
                  onClick={() => setLightbox(i)}
                  aria-label={t("open", { n: i + 1, total })}
                  className="focus-visible:ring-ring relative block size-full cursor-zoom-in focus-visible:ring-2 focus-visible:outline-none"
                >
                  {im.url ? (
                    <Image
                      src={im.url}
                      alt={im.alt ?? ""}
                      fill
                      sizes="(min-width: 1024px) 768px, 100vw"
                      className="object-cover"
                      placeholder={im.lqip ? "blur" : undefined}
                      blurDataURL={im.lqip ?? undefined}
                      priority={i === 0}
                    />
                  ) : null}
                </button>
              </div>
            ))}
          </div>
        </div>

        {!single ? (
          <>
            {/* Editorial index — current index emphasised, muted total, zero-padded. */}
            <div className="pointer-events-none absolute top-3 right-3 rounded-full bg-black/55 px-3 py-1 text-xs font-medium text-white/85 tabular-nums ring-1 ring-white/10 backdrop-blur-md">
              <span className="text-white">{pad(selected + 1)}</span>
              <span className="mx-1 opacity-50">/</span>
              <span>{pad(total)}</span>
            </div>

            <button
              type="button"
              onClick={() => mainApi?.scrollPrev()}
              aria-label={tc("previous")}
              className={cn(ARROW, "left-3")}
            >
              <ArrowLeft aria-hidden="true" className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => mainApi?.scrollNext()}
              aria-label={tc("next")}
              className={cn(ARROW, "right-3")}
            >
              <ArrowRight aria-hidden="true" className="size-5" />
            </button>
          </>
        ) : null}
      </div>

      {/* Announce slide changes to assistive tech without a visible echo. */}
      {!single ? (
        <p className="sr-only" aria-live="polite">
          {t("imageLabel", { n: selected + 1, total })}
        </p>
      ) : null}

      {/* Thumbnail strip — drag-free; the active one is ring-highlighted and
          scrolled into view by `onSelect`. */}
      {!single ? (
        // `p-1` gives the active ring room inside the clipped viewport so it's
        // never shaved at the strip's edges.
        <div ref={thumbRef} className="mt-4 overflow-hidden p-1">
          <div className="flex gap-2 md:gap-3">
            {images.map((im, i) => (
              <button
                key={im._key}
                type="button"
                onClick={() => mainApi?.scrollTo(i)}
                aria-label={t("goToImage", { n: i + 1 })}
                aria-current={i === selected}
                className={cn(
                  // `ring-inset` on the active thumb: the ring sits inside the
                  // box, so it reads fully even against the viewport clip.
                  "relative aspect-[4/3] w-16 shrink-0 overflow-hidden rounded-lg ring-1 transition focus-visible:outline-none md:w-20 lg:w-24",
                  i === selected
                    ? "ring-foreground opacity-100 ring-2 ring-inset"
                    : "ring-border/40 focus-visible:ring-ring opacity-55 hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2",
                )}
              >
                {im.url ? (
                  <Image src={im.url} alt="" fill sizes="96px" className="object-cover" />
                ) : null}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {/* Fullscreen lightbox — a near-full-viewport transparent stage over the
          Dialog's dark backdrop; each image shows at its OWN size (capped to the
          viewport), so nothing is letterboxed into a fixed frame. */}
      <Dialog open={lightbox !== null} onOpenChange={(o: boolean) => !o && setLightbox(null)}>
        <DialogContent
          showCloseButton={false}
          className="h-[100svh] w-screen max-w-none translate-x-[-50%] translate-y-[-50%] border-0 bg-transparent p-0 shadow-none sm:max-w-none"
        >
          <DialogTitle className="sr-only">
            {t("imageLabel", { n: (lightbox ?? 0) + 1, total })}
          </DialogTitle>
          <Carousel
            opts={{ startIndex: lightbox ?? 0, loop: true }}
            className="flex size-full items-center"
          >
            <CarouselContent className="ml-0 size-full">
              {images.map((im) => (
                <CarouselItem
                  key={im._key}
                  className="flex items-center justify-center pl-0"
                >
                  {im.url ? (
                    // Plain <img>: sized to its own aspect and capped to the
                    // viewport — next/image's fixed box would letterbox it. The
                    // loaderFile only rewrites `next/image`, so cap the CDN
                    // source here directly (webp/avif via `auto=format`) instead
                    // of shipping the full-res original.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`${im.url}?w=1600&auto=format&fit=max&q=80`}
                      alt={im.alt ?? ""}
                      className="max-h-[88svh] w-auto max-w-[min(1200px,92vw)] rounded-xl object-contain shadow-lg"
                    />
                  ) : null}
                </CarouselItem>
              ))}
            </CarouselContent>
            {!single ? (
              <>
                <CarouselPrevious
                  aria-label={tc("previous")}
                  className="absolute top-1/2 left-1 size-11 -translate-y-1/2 border-0 bg-black/60 text-white/90 hover:bg-black/80 hover:text-white sm:left-2"
                />
                <CarouselNext
                  aria-label={tc("next")}
                  className="absolute top-1/2 right-1 size-11 -translate-y-1/2 border-0 bg-black/60 text-white/90 hover:bg-black/80 hover:text-white sm:right-2"
                />
              </>
            ) : null}
          </Carousel>
          {/* Fixed to the viewport corner, clear of any image edge. */}
          <DialogClose className="focus-visible:ring-ring fixed top-4 right-4 z-50 rounded-full bg-black/60 p-2.5 text-white/90 backdrop-blur-sm transition hover:bg-black/80 hover:text-white focus-visible:ring-2 focus-visible:outline-none">
            <X aria-hidden="true" className="size-5" />
            <span className="sr-only">{t("close")}</span>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
}

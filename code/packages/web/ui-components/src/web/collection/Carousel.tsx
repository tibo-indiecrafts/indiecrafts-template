"use client";
/**
 * Render a scroll-snap carousel of post cards.
 *
 * @see docs/reference/packages/web/ui-components/src/web/collection/Carousel.md
 */

import { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { PostCardItem } from "@indiecrafts/packages-web-ui-components/shared/types";
import { ModuleSection } from "../layout/ModuleSection";
import { PostCard } from "./PostCard";

/**
 * A horizontally scrolling row of post cards — CSS scroll-snap (no JS
 * carousel library), with prev/next buttons that nudge the track by one
 * card width. Shares `PostCard` with `FeaturedPosts`/`SpotlightRow` for a
 * consistent card treatment. Built for the blog's `module.blog-collection`;
 * generic over already-resolved data. Renders nothing when `items` is empty.
 *
 * Accessibility follows the W3C carousel pattern: the region carries
 * `aria-roledescription="carousel"` + a label (the heading, falling back to
 * `labels.slide`); each slide is `role="group"
 * aria-roledescription={labels.slide}` with `aria-posinset`/`aria-setsize`
 * so assistive tech announces "N of M" natively — no "of" string to
 * translate. `motion-reduce` drops the smooth scroll: the track sets
 * `scroll-smooth`/`motion-reduce:scroll-auto` and `scrollBy` is called with
 * no explicit `behavior`, so it inherits the CSS `scroll-behavior`.
 */
export function Carousel({
  heading,
  intro,
  items,
  labels,
}: {
  heading?: string;
  intro?: string;
  items: PostCardItem[];
  labels: { prev: string; next: string; slide: string };
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  if (!items.length) return null;

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.firstElementChild as HTMLElement | null;
    track.scrollBy({
      left: (card?.offsetWidth ?? track.clientWidth) * direction,
    });
  };

  return (
    <ModuleSection className="@container">
      {heading || intro ? (
        <div className="mb-8 md:mb-10">
          {heading ? (
            <h2 className="text-3xl font-semibold text-balance md:text-4xl">
              {heading}
            </h2>
          ) : null}
          {intro ? (
            <p className="text-muted-foreground mt-2 max-w-2xl">{intro}</p>
          ) : null}
        </div>
      ) : null}
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label={heading ?? labels.slide}
      >
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth p-1 [scrollbar-width:none] motion-reduce:scroll-auto [&::-webkit-scrollbar]:hidden"
        >
          {items.map((post, i) => (
            <div
              key={post._key}
              role="group"
              aria-roledescription={labels.slide}
              aria-posinset={i + 1}
              aria-setsize={items.length}
              className="basis-80 shrink-0 snap-start"
            >
              <PostCard post={post} />
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            aria-label={labels.prev}
            onClick={() => scrollByCard(-1)}
            className="bg-card ring-border/60 text-foreground hover:bg-muted focus-visible:ring-ring inline-flex size-10 items-center justify-center rounded-full ring-1 transition focus-visible:ring-2 focus-visible:outline-none"
          >
            <ArrowLeft aria-hidden="true" className="size-5" />
          </button>
          <button
            type="button"
            aria-label={labels.next}
            onClick={() => scrollByCard(1)}
            className="bg-card ring-border/60 text-foreground hover:bg-muted focus-visible:ring-ring inline-flex size-10 items-center justify-center rounded-full ring-1 transition focus-visible:ring-2 focus-visible:outline-none"
          >
            <ArrowRight aria-hidden="true" className="size-5" />
          </button>
        </div>
      </div>
    </ModuleSection>
  );
}

import type { GalleryModule } from "@/features/blog/sanity/types";
import { GalleryCarousel } from "./GalleryCarousel";

/**
 * `module.gallery` renderer — the server half. Owns the block's spacing and the
 * optional title/intro, then hands the images to the client `<GalleryCarousel>`
 * (embla can't run on the server). `not-prose` so the block escapes the article
 * column's typography styles. Renders nothing when every image is empty.
 */
export function Gallery({ title, intro, ratio, images, anchor }: GalleryModule) {
  const imgs = (images ?? []).filter((im) => im.url);
  if (imgs.length === 0) return null;

  return (
    <section id={anchor} className="not-prose my-5 md:my-10">
      {title || intro ? (
        <header className="mb-4">
          {title ? (
            <h3 className="text-foreground font-sans text-xl font-semibold text-balance md:text-2xl">
              {title}
            </h3>
          ) : null}
          {intro ? (
            <p className="text-muted-foreground mt-1 text-pretty">{intro}</p>
          ) : null}
        </header>
      ) : null}
      <GalleryCarousel images={imgs} ratio={ratio} />
    </section>
  );
}

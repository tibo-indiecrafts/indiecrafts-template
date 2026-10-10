/**
 * Render the gallery module wrapper and hand its images to the client carousel.
 *
 * @see docs/reference/packages/web/ui-components/src/web/media/Gallery.md
 */
import type { GalleryModule } from "@indiecrafts/packages-web-ui-components/shared/types";
import { RichTitle } from "../RichTitle";
import { ModuleSection } from "../layout/ModuleSection";
import { GalleryCarousel } from "./GalleryCarousel";

/**
 * `module.gallery` renderer — the server half. Owns the block's spacing and the
 * optional title/intro, then hands the images to the client `<GalleryCarousel>`
 * (embla can't run on the server). `ModuleSection` gives it page gutters as a section and
 * `not-prose` inline. Renders nothing when every image is empty.
 */
export function Gallery({
  title,
  intro,
  ratio,
  images,
  anchor,
  inline,
}: GalleryModule & { inline?: boolean }) {
  const imgs = (images ?? []).filter((im) => im.url);
  if (imgs.length === 0) return null;

  return (
    <ModuleSection anchor={anchor} inline={inline} className="@container">
      {title || intro ? (
        <header className="mb-4">
          {title ? (
            <RichTitle
              as="h3"
              className="text-foreground font-sans text-xl font-semibold text-balance @2xl:text-2xl"
            >
              {title}
            </RichTitle>
          ) : null}
          {intro ? (
            <p className="text-muted-foreground mt-1 text-pretty">{intro}</p>
          ) : null}
        </header>
      ) : null}
      <GalleryCarousel images={imgs} ratio={ratio} />
    </ModuleSection>
  );
}

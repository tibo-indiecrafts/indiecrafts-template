import type { MediaModalBlock } from "./schema";

export const mediaModalKey = "media-modal" as const;
export const mediaModalNamespace = "blocks.media-modal" as const;

export const mediaModalSample: Omit<MediaModalBlock, "id"> = {
  type: "media-modal",
  imgSrc:
    "https://images.unsplash.com/photo-1709949908058-a08659bfa922?q=80&w=1600&auto=format",
  titleKey: "blocks.media-modal.title",
  altKey: "blocks.media-modal.alt",
  closeLabelKey: "blocks.media-modal.closeLabel",
};

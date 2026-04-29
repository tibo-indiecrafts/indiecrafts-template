import type { Content1Block } from "./schema";

/**
 * Default instance of the content-1 block. Keys resolve under
 * `blocks.content-1.*`. Image paths are asset references (not translations)
 * and live here in config — replace with real assets when forking.
 */
export const content1Sample: Omit<Content1Block, "id"> = {
  type: "content-1",
  titleKey: "blocks.content-1.title",
  leadingKey: "blocks.content-1.leading",
  supportingKey: "blocks.content-1.supporting",
  quoteKey: "blocks.content-1.quote",
  quoteAuthorKey: "blocks.content-1.author",
  imageLightUrl: "/placeholder.svg",
  imageDarkUrl: "/placeholder.svg",
  imageAltKey: "blocks.content-1.imageAlt",
};

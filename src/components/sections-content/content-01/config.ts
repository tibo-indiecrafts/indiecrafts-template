import type { ContentBlock } from "./schema";

export const content01Key = "content-01" as const;
export const content01Namespace = "blocks.content-01" as const;

export const content01Sample: Omit<ContentBlock, "id"> = {
  type: "content-01",
  titleKey: "blocks.content-01.title",
  leadingKey: "blocks.content-01.leading",
  supportingKey: "blocks.content-01.supporting",
  quoteKey: "blocks.content-01.quote",
  quoteAuthorKey: "blocks.content-01.author",
  imageLightUrl: "/placeholder.svg",
  imageDarkUrl: "/placeholder.svg",
  imageAltKey: "blocks.content-01.imageAlt",
};

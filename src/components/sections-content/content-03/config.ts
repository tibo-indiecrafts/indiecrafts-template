import type { ContentBlock } from "./schema";

export const content03Key = "content-03" as const;
export const content03Namespace = "blocks.content-03" as const;

export const content03Sample: Omit<ContentBlock, "id"> = {
  type: "content-03",
  titleKey: "blocks.content-03.title",
  bodyKey: "blocks.content-03.body",
  ctaLabelKey: "blocks.content-03.cta",
  ctaHref: "#",
  imageUrl:
    "https://images.unsplash.com/photo-1530099486328-e021101a494a?q=80&w=1600&auto=format&fit=crop",
  imageAltKey: "blocks.content-03.imageAlt",
};

import type { Content3Block } from "./schema";

export const content3Sample: Omit<Content3Block, "id"> = {
  type: "content-3",
  titleKey: "blocks.content-3.title",
  bodyKey: "blocks.content-3.body",
  ctaLabelKey: "blocks.content-3.cta",
  ctaHref: "#",
  imageUrl:
    "https://images.unsplash.com/photo-1530099486328-e021101a494a?q=80&w=1600&auto=format&fit=crop",
  imageAltKey: "blocks.content-3.imageAlt",
};

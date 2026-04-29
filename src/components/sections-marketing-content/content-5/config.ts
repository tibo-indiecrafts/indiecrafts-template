import type { Content5Block } from "./schema";

export const content5Sample: Omit<Content5Block, "id"> = {
  type: "content-5",
  titleKey: "blocks.content-5.title",
  bodyKey: "blocks.content-5.body",
  imageUrl:
    "https://images.unsplash.com/photo-1616587226960-4a03badbe8bf?q=80&w=2400&auto=format&fit=crop",
  imageAltKey: "blocks.content-5.imageAlt",
  features: [
    {
      iconKey: "zap",
      titleKey: "blocks.content-5.features.fast.title",
      bodyKey: "blocks.content-5.features.fast.body",
    },
    {
      iconKey: "cpu",
      titleKey: "blocks.content-5.features.powerful.title",
      bodyKey: "blocks.content-5.features.powerful.body",
    },
    {
      iconKey: "lock",
      titleKey: "blocks.content-5.features.secure.title",
      bodyKey: "blocks.content-5.features.secure.body",
    },
    {
      iconKey: "sparkles",
      titleKey: "blocks.content-5.features.smart.title",
      bodyKey: "blocks.content-5.features.smart.body",
    },
  ],
};

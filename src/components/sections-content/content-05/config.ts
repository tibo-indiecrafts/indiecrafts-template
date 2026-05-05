import type { ContentBlock } from "./schema";

export const content05Key = "content-05" as const;
export const content05Namespace = "blocks.content-05" as const;

export const content05Sample: Omit<ContentBlock, "id"> = {
  type: "content-05",
  titleKey: "blocks.content-05.title",
  bodyKey: "blocks.content-05.body",
  imageUrl:
    "https://images.unsplash.com/photo-1616587226960-4a03badbe8bf?q=80&w=2400&auto=format&fit=crop",
  imageAltKey: "blocks.content-05.imageAlt",
  features: [
    {
      iconKey: "zap",
      titleKey: "blocks.content-05.features.fast.title",
      bodyKey: "blocks.content-05.features.fast.body",
    },
    {
      iconKey: "cpu",
      titleKey: "blocks.content-05.features.powerful.title",
      bodyKey: "blocks.content-05.features.powerful.body",
    },
    {
      iconKey: "lock",
      titleKey: "blocks.content-05.features.secure.title",
      bodyKey: "blocks.content-05.features.secure.body",
    },
    {
      iconKey: "sparkles",
      titleKey: "blocks.content-05.features.smart.title",
      bodyKey: "blocks.content-05.features.smart.body",
    },
  ],
};

import type { Content7Block } from "./schema";

export const content7Sample: Omit<Content7Block, "id"> = {
  type: "content-7",
  titleKey: "blocks.content-7.title",
  leadingKey: "blocks.content-7.leading",
  supportingKey: "blocks.content-7.supporting",
  features: [
    {
      iconKey: "zap",
      titleKey: "blocks.content-7.features.fast.title",
      bodyKey: "blocks.content-7.features.fast.body",
    },
    {
      iconKey: "cpu",
      titleKey: "blocks.content-7.features.powerful.title",
      bodyKey: "blocks.content-7.features.powerful.body",
    },
  ],
  imageLightUrl: "/placeholder.svg",
  imageDarkUrl: "/placeholder.svg",
  imageAltKey: "blocks.content-7.imageAlt",
};

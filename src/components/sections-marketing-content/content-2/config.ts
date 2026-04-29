import type { Content2Block } from "./schema";

export const content2Sample: Omit<Content2Block, "id"> = {
  type: "content-2",
  titleKey: "blocks.content-2.title",
  leadingKey: "blocks.content-2.leading",
  supportingKey: "blocks.content-2.supporting",
  features: [
    {
      iconKey: "zap",
      titleKey: "blocks.content-2.features.fast.title",
      bodyKey: "blocks.content-2.features.fast.body",
    },
    {
      iconKey: "cpu",
      titleKey: "blocks.content-2.features.powerful.title",
      bodyKey: "blocks.content-2.features.powerful.body",
    },
  ],
  imageLightUrl: "/placeholder.svg",
  imageDarkUrl: "/placeholder.svg",
  imageAltKey: "blocks.content-2.imageAlt",
};

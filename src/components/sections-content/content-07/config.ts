import type { ContentBlock } from "./schema";

export const content07Key = "content-07" as const;
export const content07Namespace = "blocks.content-07" as const;

export const content07Sample: Omit<ContentBlock, "id"> = {
  type: "content-07",
  titleKey: "blocks.content-07.title",
  leadingKey: "blocks.content-07.leading",
  supportingKey: "blocks.content-07.supporting",
  features: [
    {
      iconKey: "zap",
      titleKey: "blocks.content-07.features.fast.title",
      bodyKey: "blocks.content-07.features.fast.body",
    },
    {
      iconKey: "cpu",
      titleKey: "blocks.content-07.features.powerful.title",
      bodyKey: "blocks.content-07.features.powerful.body",
    },
  ],
  imageLightUrl: "/placeholder.svg",
  imageDarkUrl: "/placeholder.svg",
  imageAltKey: "blocks.content-07.imageAlt",
};

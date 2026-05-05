import type { ContentBlock } from "./schema";

export const content02Key = "content-02" as const;
export const content02Namespace = "blocks.content-02" as const;

export const content02Sample: Omit<ContentBlock, "id"> = {
  type: "content-02",
  titleKey: "blocks.content-02.title",
  leadingKey: "blocks.content-02.leading",
  supportingKey: "blocks.content-02.supporting",
  features: [
    {
      iconKey: "zap",
      titleKey: "blocks.content-02.features.fast.title",
      bodyKey: "blocks.content-02.features.fast.body",
    },
    {
      iconKey: "cpu",
      titleKey: "blocks.content-02.features.powerful.title",
      bodyKey: "blocks.content-02.features.powerful.body",
    },
  ],
  imageLightUrl: "/placeholder.svg",
  imageDarkUrl: "/placeholder.svg",
  imageAltKey: "blocks.content-02.imageAlt",
};

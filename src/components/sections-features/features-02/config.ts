import type { FeaturesBlock } from "./schema";

export const features02Key = "features-02" as const;
export const features02Namespace = "blocks.features-02" as const;

export const features02Sample: Omit<FeaturesBlock, "id"> = {
  type: "features-02",
  titleKey: "blocks.features-02.title",
  bodyKey: "blocks.features-02.body",
  items: [
    {
      iconKey: "zap",
      titleKey: "blocks.features-02.items.fast.title",
      bodyKey: "blocks.features-02.items.fast.body",
    },
    {
      iconKey: "settings",
      titleKey: "blocks.features-02.items.custom.title",
      bodyKey: "blocks.features-02.items.custom.body",
    },
    {
      iconKey: "sparkles",
      titleKey: "blocks.features-02.items.polished.title",
      bodyKey: "blocks.features-02.items.polished.body",
    },
  ],
};

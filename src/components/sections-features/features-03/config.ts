import type { FeaturesBlock } from "./schema";

export const features03Key = "features-03" as const;
export const features03Namespace = "blocks.features-03" as const;

export const features03Sample: Omit<FeaturesBlock, "id"> = {
  type: "features-03",
  titleKey: "blocks.features-03.title",
  bodyKey: "blocks.features-03.body",
  items: [
    {
      iconKey: "zap",
      titleKey: "blocks.features-03.items.fast.title",
      bodyKey: "blocks.features-03.items.fast.body",
    },
    {
      iconKey: "settings",
      titleKey: "blocks.features-03.items.control.title",
      bodyKey: "blocks.features-03.items.control.body",
    },
    {
      iconKey: "sparkles",
      titleKey: "blocks.features-03.items.ai.title",
      bodyKey: "blocks.features-03.items.ai.body",
    },
  ],
};

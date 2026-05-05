import type { FeaturesBlock } from "./schema";

export const features01Key = "features-01" as const;
export const features01Namespace = "blocks.features-01" as const;

export const features01Sample: Omit<FeaturesBlock, "id"> = {
  type: "features-01",
  titleKey: "blocks.features-01.title",
  bodyKey: "blocks.features-01.body",
  items: [
    {
      iconKey: "zap",
      titleKey: "blocks.features-01.items.customizable.title",
      bodyKey: "blocks.features-01.items.customizable.body",
    },
    {
      iconKey: "settings",
      titleKey: "blocks.features-01.items.fullControl.title",
      bodyKey: "blocks.features-01.items.fullControl.body",
    },
    {
      iconKey: "sparkles",
      titleKey: "blocks.features-01.items.poweredByAi.title",
      bodyKey: "blocks.features-01.items.poweredByAi.body",
    },
  ],
};

import type { FeaturesBlock } from "./schema";

export const features13Key = "features-13" as const;
export const features13Namespace = "blocks.features-13" as const;

export const features13Sample: Omit<FeaturesBlock, "id"> = {
  type: "features-13",
  items: [
    {
      illustration: "chart",
      titleKey: "blocks.features-13.items.analytics.title",
      bodyKey: "blocks.features-13.items.analytics.body",
    },
    {
      illustration: "invoice",
      titleKey: "blocks.features-13.items.invoicing.title",
      bodyKey: "blocks.features-13.items.invoicing.body",
    },
  ],
};

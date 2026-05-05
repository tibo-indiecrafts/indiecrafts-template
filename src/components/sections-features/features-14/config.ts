import type { FeaturesBlock } from "./schema";

export const features14Key = "features-14" as const;
export const features14Namespace = "blocks.features-14" as const;

export const features14Sample: Omit<FeaturesBlock, "id"> = {
  type: "features-14",
  items: [
    {
      illustration: "message",
      titleKey: "blocks.features-14.items.collaboration.title",
      bodyKey: "blocks.features-14.items.collaboration.body",
    },
    {
      illustration: "integrations",
      titleKey: "blocks.features-14.items.integrations.title",
      bodyKey: "blocks.features-14.items.integrations.body",
    },
  ],
};

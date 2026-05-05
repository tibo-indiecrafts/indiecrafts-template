import type { FeaturesBlock } from "./schema";

export const features04Key = "features-04" as const;
export const features04Namespace = "blocks.features-04" as const;

export const features04Sample: Omit<FeaturesBlock, "id"> = {
  type: "features-04",
  titleKey: "blocks.features-04.title",
  bodyKey: "blocks.features-04.body",
  items: [
    {
      iconKey: "zap",
      titleKey: "blocks.features-04.items.fast.title",
      bodyKey: "blocks.features-04.items.fast.body",
    },
    {
      iconKey: "cpu",
      titleKey: "blocks.features-04.items.powerful.title",
      bodyKey: "blocks.features-04.items.powerful.body",
    },
    {
      iconKey: "fingerprint",
      titleKey: "blocks.features-04.items.security.title",
      bodyKey: "blocks.features-04.items.security.body",
    },
    {
      iconKey: "pencil",
      titleKey: "blocks.features-04.items.custom.title",
      bodyKey: "blocks.features-04.items.custom.body",
    },
    {
      iconKey: "settings",
      titleKey: "blocks.features-04.items.control.title",
      bodyKey: "blocks.features-04.items.control.body",
    },
    {
      iconKey: "sparkles",
      titleKey: "blocks.features-04.items.ai.title",
      bodyKey: "blocks.features-04.items.ai.body",
    },
  ],
};

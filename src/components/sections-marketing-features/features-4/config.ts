import type { Features4Block } from "./schema";

export const features4Sample: Omit<Features4Block, "id"> = {
  type: "features-4",
  titleKey: "blocks.features-4.title",
  bodyKey: "blocks.features-4.body",
  items: [
    {
      iconKey: "zap",
      titleKey: "blocks.features-4.items.fast.title",
      bodyKey: "blocks.features-4.items.fast.body",
    },
    {
      iconKey: "cpu",
      titleKey: "blocks.features-4.items.powerful.title",
      bodyKey: "blocks.features-4.items.powerful.body",
    },
    {
      iconKey: "fingerprint",
      titleKey: "blocks.features-4.items.security.title",
      bodyKey: "blocks.features-4.items.security.body",
    },
    {
      iconKey: "pencil",
      titleKey: "blocks.features-4.items.custom.title",
      bodyKey: "blocks.features-4.items.custom.body",
    },
    {
      iconKey: "settings",
      titleKey: "blocks.features-4.items.control.title",
      bodyKey: "blocks.features-4.items.control.body",
    },
    {
      iconKey: "sparkles",
      titleKey: "blocks.features-4.items.ai.title",
      bodyKey: "blocks.features-4.items.ai.body",
    },
  ],
};

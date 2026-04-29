import type { Features2Block } from "./schema";

export const features2Sample: Omit<Features2Block, "id"> = {
  type: "features-2",
  titleKey: "blocks.features-2.title",
  bodyKey: "blocks.features-2.body",
  items: [
    {
      iconKey: "zap",
      titleKey: "blocks.features-2.items.fast.title",
      bodyKey: "blocks.features-2.items.fast.body",
    },
    {
      iconKey: "settings",
      titleKey: "blocks.features-2.items.custom.title",
      bodyKey: "blocks.features-2.items.custom.body",
    },
    {
      iconKey: "sparkles",
      titleKey: "blocks.features-2.items.polished.title",
      bodyKey: "blocks.features-2.items.polished.body",
    },
  ],
};

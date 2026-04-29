import type { Features3Block } from "./schema";

export const features3Sample: Omit<Features3Block, "id"> = {
  type: "features-3",
  titleKey: "blocks.features-3.title",
  bodyKey: "blocks.features-3.body",
  items: [
    {
      iconKey: "zap",
      titleKey: "blocks.features-3.items.fast.title",
      bodyKey: "blocks.features-3.items.fast.body",
    },
    {
      iconKey: "settings",
      titleKey: "blocks.features-3.items.control.title",
      bodyKey: "blocks.features-3.items.control.body",
    },
    {
      iconKey: "sparkles",
      titleKey: "blocks.features-3.items.ai.title",
      bodyKey: "blocks.features-3.items.ai.body",
    },
  ],
};

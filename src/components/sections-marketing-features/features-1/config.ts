import type { Features1Block } from "./schema";

export const features1Sample: Omit<Features1Block, "id"> = {
  type: "features-1",
  titleKey: "blocks.features-1.title",
  bodyKey: "blocks.features-1.body",
  items: [
    {
      iconKey: "zap",
      titleKey: "blocks.features-1.items.customizable.title",
      bodyKey: "blocks.features-1.items.customizable.body",
    },
    {
      iconKey: "settings",
      titleKey: "blocks.features-1.items.fullControl.title",
      bodyKey: "blocks.features-1.items.fullControl.body",
    },
    {
      iconKey: "sparkles",
      titleKey: "blocks.features-1.items.poweredByAi.title",
      bodyKey: "blocks.features-1.items.poweredByAi.body",
    },
  ],
};

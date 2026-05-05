import type { FeaturesBlock } from "./schema";

export const features19Key = "features-19" as const;
export const features19Namespace = "blocks.features-19" as const;

export const features19Sample: Omit<FeaturesBlock, "id"> = {
  type: "features-19",
  stats: [
    {
      iconKey: "clock",
      titleKey: "blocks.features-19.stats.responseTime.title",
      bodyKey: "blocks.features-19.stats.responseTime.body",
    },
    {
      iconKey: "zap",
      titleKey: "blocks.features-19.stats.shipFast.title",
      bodyKey: "blocks.features-19.stats.shipFast.body",
    },
    {
      iconKey: "calendar",
      titleKey: "blocks.features-19.stats.alwaysOn.title",
      bodyKey: "blocks.features-19.stats.alwaysOn.body",
    },
  ],
};

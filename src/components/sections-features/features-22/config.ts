import type { FeaturesBlock } from "./schema";

export const features22Key = "features-22" as const;
export const features22Namespace = "blocks.features-22" as const;

export const features22Sample: Omit<FeaturesBlock, "id"> = {
  type: "features-22",
  titleKey: "blocks.features-22.title",
  bodyKey: "blocks.features-22.body",
  ctaLabelKey: "blocks.features-22.cta",
  ctaHref: "#",
  stats: [
    {
      iconKey: "zap",
      titleKey: "blocks.features-22.stats.fast.title",
      bodyKey: "blocks.features-22.stats.fast.body",
    },
    {
      iconKey: "cpu",
      titleKey: "blocks.features-22.stats.powerful.title",
      bodyKey: "blocks.features-22.stats.powerful.body",
    },
    {
      iconKey: "lock",
      titleKey: "blocks.features-22.stats.security.title",
      bodyKey: "blocks.features-22.stats.security.body",
    },
    {
      iconKey: "sparkles",
      titleKey: "blocks.features-22.stats.aiPowered.title",
      bodyKey: "blocks.features-22.stats.aiPowered.body",
    },
  ],
};

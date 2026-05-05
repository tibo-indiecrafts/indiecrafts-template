import type { FeaturesBlock } from "./schema";

export const features26Key = "features-26" as const;
export const features26Namespace = "blocks.features-26" as const;

export const features26Sample: Omit<FeaturesBlock, "id"> = {
  type: "features-26",
  titleKey: "blocks.features-26.title",
  bodyKey: "blocks.features-26.body",
  introKey: "blocks.features-26.intro",
  ctaLabelKey: "blocks.features-26.cta",
  ctaHref: "#",
  stats: [
    {
      iconKey: "zap",
      titleKey: "blocks.features-26.stats.fast.title",
      bodyKey: "blocks.features-26.stats.fast.body",
    },
    {
      iconKey: "cpu",
      titleKey: "blocks.features-26.stats.powerful.title",
      bodyKey: "blocks.features-26.stats.powerful.body",
    },
    {
      iconKey: "lock",
      titleKey: "blocks.features-26.stats.security.title",
      bodyKey: "blocks.features-26.stats.security.body",
    },
    {
      iconKey: "sparkles",
      titleKey: "blocks.features-26.stats.aiPowered.title",
      bodyKey: "blocks.features-26.stats.aiPowered.body",
    },
  ],
};

import type { FeaturesBlock } from "./schema";

export const features23Key = "features-23" as const;
export const features23Namespace = "blocks.features-23" as const;

export const features23Sample: Omit<FeaturesBlock, "id"> = {
  type: "features-23",
  cards: [
    {
      illustration: "invoice",
      titleKey: "blocks.features-23.cards.invoicing.title",
      bodyKey: "blocks.features-23.cards.invoicing.body",
    },
    {
      illustration: "integrations",
      titleKey: "blocks.features-23.cards.integrations.title",
      bodyKey: "blocks.features-23.cards.integrations.body",
    },
  ],
  stats: [
    {
      iconKey: "zap",
      titleKey: "blocks.features-23.stats.fast.title",
      bodyKey: "blocks.features-23.stats.fast.body",
    },
    {
      iconKey: "cpu",
      titleKey: "blocks.features-23.stats.powerful.title",
      bodyKey: "blocks.features-23.stats.powerful.body",
    },
    {
      iconKey: "lock",
      titleKey: "blocks.features-23.stats.security.title",
      bodyKey: "blocks.features-23.stats.security.body",
    },
    {
      iconKey: "sparkles",
      titleKey: "blocks.features-23.stats.aiPowered.title",
      bodyKey: "blocks.features-23.stats.aiPowered.body",
    },
  ],
};

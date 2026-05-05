import type { FeaturesBlock } from "./schema";

export const features16Key = "features-16" as const;
export const features16Namespace = "blocks.features-16" as const;

export const features16Sample: Omit<FeaturesBlock, "id"> = {
  type: "features-16",
  cards: [
    {
      illustration: "invoice",
      titleKey: "blocks.features-16.cards.invoicing.title",
      bodyKey: "blocks.features-16.cards.invoicing.body",
    },
    {
      illustration: "visualization",
      titleKey: "blocks.features-16.cards.visualization.title",
      bodyKey: "blocks.features-16.cards.visualization.body",
    },
  ],
  stats: [
    {
      iconKey: "zap",
      titleKey: "blocks.features-16.stats.fast.title",
      bodyKey: "blocks.features-16.stats.fast.body",
    },
    {
      iconKey: "cpu",
      titleKey: "blocks.features-16.stats.powerful.title",
      bodyKey: "blocks.features-16.stats.powerful.body",
    },
    {
      iconKey: "lock",
      titleKey: "blocks.features-16.stats.security.title",
      bodyKey: "blocks.features-16.stats.security.body",
    },
    {
      iconKey: "sparkles",
      titleKey: "blocks.features-16.stats.aiPowered.title",
      bodyKey: "blocks.features-16.stats.aiPowered.body",
    },
  ],
};

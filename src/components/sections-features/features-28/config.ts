import type { FeaturesBlock } from "./schema";

export const features28Key = "features-28" as const;
export const features28Namespace = "blocks.features-28" as const;

export const features28Sample: Omit<FeaturesBlock, "id"> = {
  type: "features-28",
  eyebrowKey: "blocks.features-28.eyebrow",
  titleKey: "blocks.features-28.title",
  bodyKey: "blocks.features-28.body",
  cards: [
    {
      titleKey: "blocks.features-28.cards.card1.title",
      bodyKey: "blocks.features-28.cards.card1.body",
    },
    {
      titleKey: "blocks.features-28.cards.card2.title",
      bodyKey: "blocks.features-28.cards.card2.body",
    },
  ],
};

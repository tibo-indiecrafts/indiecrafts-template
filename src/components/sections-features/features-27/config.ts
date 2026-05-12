import type { FeaturesBlock } from "./schema";

export const features27Key = "features-27" as const;
export const features27Namespace = "blocks.features-27" as const;

export const features27Sample: Omit<FeaturesBlock, "id"> = {
  type: "features-27",
  eyebrowKey: "blocks.features-27.eyebrow",
  titleKey: "blocks.features-27.title",
  bodyKey: "blocks.features-27.body",
  cards: [
    {
      titleKey: "blocks.features-27.cards.card1.title",
      bodyKey: "blocks.features-27.cards.card1.body",
    },
    {
      titleKey: "blocks.features-27.cards.card2.title",
      bodyKey: "blocks.features-27.cards.card2.body",
    },
    {
      titleKey: "blocks.features-27.cards.card3.title",
      bodyKey: "blocks.features-27.cards.card3.body",
    },
    {
      titleKey: "blocks.features-27.cards.card4.title",
      bodyKey: "blocks.features-27.cards.card4.body",
    },
  ],
};

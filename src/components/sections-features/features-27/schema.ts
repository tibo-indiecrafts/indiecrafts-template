import type { MessageKey } from "@/types/messages";

export type FeaturesCard = {
  titleKey: MessageKey;
  bodyKey: MessageKey;
};

export type FeaturesBlock = {
  type: "features-27";
  id: string;
  eyebrowKey: MessageKey;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  cards: readonly [FeaturesCard, FeaturesCard, FeaturesCard, FeaturesCard];
};

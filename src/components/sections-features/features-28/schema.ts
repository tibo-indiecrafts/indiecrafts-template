import type { MessageKey } from "@/types/messages";

/**
 * Tailark Pro `dark-landing-one` MoreFeatures — eyebrow + 2-column
 * heading/body intro + 2-card grid (each card: title block above
 * full-bleed payment-flow illustration). Card 1 uses the
 * "complete-payment" mock, card 2 uses "link-payment".
 */
export type FeaturesCard = {
  titleKey: MessageKey;
  bodyKey: MessageKey;
};

export type FeaturesBlock = {
  type: "features-28";
  id: string;
  eyebrowKey: MessageKey;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  cards: readonly [FeaturesCard, FeaturesCard];
};

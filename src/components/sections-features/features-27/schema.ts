import type { MessageKey } from "@/types/messages";

/**
 * Tailark Pro `dark-landing-one` PlatformFeatures bento — eyebrow
 * + 2-column heading/body intro, then a 4-card asymmetric bento.
 * Card layouts are POSITIONAL: card 1 spans 3 rows w/ bottom-bleed
 * KitIllustration, cards 2/3 stack title-over-illustration, card 4
 * sits on the bottom-full row with a gradient bg + ReplyIllustration
 * to the right.
 */
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

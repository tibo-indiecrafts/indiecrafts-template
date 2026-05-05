import type { MessageKey } from "@/types/messages";

export type FeaturesIllustration = "invoice" | "visualization";

export type StatIcon = "zap" | "cpu" | "lock" | "sparkles";

export type FeatureCard = {
  illustration: FeaturesIllustration;
  titleKey: MessageKey;
  bodyKey: MessageKey;
};

export type StatItem = {
  iconKey: StatIcon;
  titleKey: MessageKey;
  bodyKey: MessageKey;
};

/**
 * Tailark Pro `features-4` — two-column hero (illustrated invoice + a
 * data-visualization mock) above a 4-stat footer strip with icon
 * highlights. Converted to the template pattern: props-driven cards
 * AND props-driven stats, MessageKey-typed strings, theme tokens.
 */
export type FeaturesBlock = {
  type: "features-16";
  id: string;
  titleKey?: MessageKey;
  bodyKey?: MessageKey;
  cards: readonly [FeatureCard, FeatureCard];
  stats: readonly [StatItem, StatItem, StatItem, StatItem];
};

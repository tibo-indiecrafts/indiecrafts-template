import type { MessageKey } from "@/types/messages";

export type CardIllustration = "invoice" | "integrations";

export type StatIcon = "zap" | "cpu" | "lock" | "sparkles";

export type FeatureCard = {
  illustration: CardIllustration;
  titleKey: MessageKey;
  bodyKey: MessageKey;
};

export type StatItem = {
  iconKey: StatIcon;
  titleKey: MessageKey;
  bodyKey: MessageKey;
};

/**
 * Tailark Pro `features-11` — full-bleed bordered grid: top half is two
 * illustrated cards (invoice + integrations), bottom half is a 4-stat
 * row, with crosshair "+" decorators stamped into the four outer
 * corners and one interior cross-point. Converted to the template
 * pattern: props-driven cards + stats, MessageKey-typed strings, theme
 * tokens.
 */
export type FeaturesBlock = {
  type: "features-23";
  id: string;
  titleKey?: MessageKey;
  bodyKey?: MessageKey;
  cards: readonly [FeatureCard, FeatureCard];
  stats: readonly [StatItem, StatItem, StatItem, StatItem];
};

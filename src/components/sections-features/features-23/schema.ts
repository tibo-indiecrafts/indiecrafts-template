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

export type FeaturesBlock = {
  type: "features-23";
  id: string;
  titleKey?: MessageKey;
  bodyKey?: MessageKey;
  cards: readonly [FeatureCard, FeatureCard];
  stats: readonly [StatItem, StatItem, StatItem, StatItem];
};

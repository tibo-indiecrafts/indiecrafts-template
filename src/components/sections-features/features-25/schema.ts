import type { MessageKey } from "@/types/messages";

export type CardIllustration = "invoice" | "integrations" | "map" | "visualization";

export type FeatureCard = {
  illustration: CardIllustration;
  titleKey: MessageKey;
  bodyKey: MessageKey;
};

export type KpiItem = {
  valueKey: MessageKey;
  labelKey: MessageKey;
};

export type Testimonial = {
  quoteKey: MessageKey;
  authorNameKey: MessageKey;
  authorRoleKey: MessageKey;
  authorAvatarUrl: string;
  authorInitialsKey: MessageKey;
};

export type FeaturesBlock = {
  type: "features-25";
  id: string;
  titleKey?: MessageKey;
  bodyKey?: MessageKey;
  cards: readonly [FeatureCard, FeatureCard, FeatureCard, FeatureCard];
  kpis: readonly [KpiItem, KpiItem];
  testimonial: Testimonial;
};

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

/**
 * Tailark Pro `features-13` — the densest features layout: 4 large
 * illustrated cards (invoice / integrations / map / visualization),
 * 2 KPI cells, and 1 customer testimonial — all fitted into a single
 * full-bleed bordered grid with crosshair "+" decorators at every
 * outer corner and interior cross-point. Converted to the template
 * pattern: props-driven cards, KPIs, and testimonial, MessageKey-typed
 * strings, theme tokens.
 */
export type FeaturesBlock = {
  type: "features-25";
  id: string;
  titleKey?: MessageKey;
  bodyKey?: MessageKey;
  cards: readonly [FeatureCard, FeatureCard, FeatureCard, FeatureCard];
  kpis: readonly [KpiItem, KpiItem];
  testimonial: Testimonial;
};

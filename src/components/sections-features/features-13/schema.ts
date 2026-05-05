import type { MessageKey } from "@/types/messages";

export type FeaturesIllustration = "chart" | "invoice";

export type FeatureItem = {
  illustration: FeaturesIllustration;
  titleKey: MessageKey;
  bodyKey: MessageKey;
};

/**
 * Tailark Pro `features-1` — two-column card grid with embedded
 * illustrations (analytics chart + invoice mock). Subgrid rows align
 * heading + illustration baselines across both columns. Converted to
 * the template pattern: props-driven items, MessageKey-typed strings,
 * theme tokens.
 */
export type FeaturesBlock = {
  type: "features-13";
  id: string;
  titleKey?: MessageKey;
  bodyKey?: MessageKey;
  items: readonly [FeatureItem, FeatureItem];
};

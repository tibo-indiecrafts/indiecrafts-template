import type { MessageKey } from "@/types/messages";

export type FeaturesIllustration = "message" | "uptime" | "poll";

export type FeatureItem = {
  illustration: FeaturesIllustration;
  titleKey: MessageKey;
  bodyKey: MessageKey;
};

/**
 * Tailark Pro `features-3` — three-column card with subgrid rows
 * keeping illustration heights and text baselines aligned across all
 * three. Converted to the template pattern: props-driven items,
 * MessageKey-typed strings, theme tokens.
 */
export type FeaturesBlock = {
  type: "features-15";
  id: string;
  titleKey?: MessageKey;
  bodyKey?: MessageKey;
  items: readonly [FeatureItem, FeatureItem, FeatureItem];
};

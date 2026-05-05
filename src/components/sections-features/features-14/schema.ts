import type { MessageKey } from "@/types/messages";

export type FeaturesIllustration = "message" | "integrations";

export type FeatureItem = {
  illustration: FeaturesIllustration;
  titleKey: MessageKey;
  bodyKey: MessageKey;
};

/**
 * Tailark Pro `features-2` — two-column card grid where each column is
 * an illustration above a centered title + body. Subgrid rows align
 * illustration heights and text baselines across both columns.
 * Converted to the template pattern: props-driven items, MessageKey-
 * typed strings, theme tokens.
 */
export type FeaturesBlock = {
  type: "features-14";
  id: string;
  titleKey?: MessageKey;
  bodyKey?: MessageKey;
  items: readonly [FeatureItem, FeatureItem];
};

import type { MessageKey } from "@/types/messages";
import type { FeatureItem } from "@/components/sections-features/features-01/schema";

export type { FeatureItem };

/**
 * Tailark `features-3` — 3-cell grid inside a single rounded card with
 * dividers. Same content shape as features-1/2.
 */
export type FeaturesBlock = {
  type: "features-03";
  id: string;
  titleKey?: MessageKey;
  bodyKey?: MessageKey;
  items: readonly FeatureItem[];
};

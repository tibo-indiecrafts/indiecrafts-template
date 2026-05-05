import type { MessageKey } from "@/types/messages";
import type { FeatureItem } from "@/components/sections-features/features-01/schema";

export type { FeatureItem };

/**
 * Tailark `features-2` — borderless card grid with a decorator mask around
 * each icon. Shares `FeatureItem` with `features-1`; only the layout differs.
 */
export type FeaturesBlock = {
  type: "features-02";
  id: string;
  titleKey?: MessageKey;
  bodyKey?: MessageKey;
  items: readonly FeatureItem[];
};

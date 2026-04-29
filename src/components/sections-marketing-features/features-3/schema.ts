import type { MessageKey } from "@/types/messages";
import type { FeatureItem } from "@/components/sections-marketing-features/features-1/schema";

export type { FeatureItem };

/**
 * Tailark `features-3` — 3-cell grid inside a single rounded card with
 * dividers. Same content shape as features-1/2.
 */
export type Features3Block = {
  type: "features-3";
  id: string;
  titleKey: MessageKey;
  bodyKey?: MessageKey;
  items: readonly FeatureItem[];
};

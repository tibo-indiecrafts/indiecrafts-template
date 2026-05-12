import type { MessageKey } from "@/types/messages";
import type { FeatureItem } from "@/components/sections-features/features-01/schema";

export type { FeatureItem };

export type FeaturesBlock = {
  type: "features-03";
  id: string;
  titleKey?: MessageKey;
  bodyKey?: MessageKey;
  items: readonly FeatureItem[];
};

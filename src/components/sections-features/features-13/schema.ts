import type { MessageKey } from "@/types/messages";

export type FeaturesIllustration = "chart" | "invoice";

export type FeatureItem = {
  illustration: FeaturesIllustration;
  titleKey: MessageKey;
  bodyKey: MessageKey;
};

export type FeaturesBlock = {
  type: "features-13";
  id: string;
  titleKey?: MessageKey;
  bodyKey?: MessageKey;
  items: readonly [FeatureItem, FeatureItem];
};

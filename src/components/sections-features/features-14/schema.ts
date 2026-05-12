import type { MessageKey } from "@/types/messages";

export type FeaturesIllustration = "message" | "integrations";

export type FeatureItem = {
  illustration: FeaturesIllustration;
  titleKey: MessageKey;
  bodyKey: MessageKey;
};

export type FeaturesBlock = {
  type: "features-14";
  id: string;
  titleKey?: MessageKey;
  bodyKey?: MessageKey;
  items: readonly [FeatureItem, FeatureItem];
};

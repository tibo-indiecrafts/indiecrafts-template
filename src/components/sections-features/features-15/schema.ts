import type { MessageKey } from "@/types/messages";

export type FeaturesIllustration = "message" | "uptime" | "poll";

export type FeatureItem = {
  illustration: FeaturesIllustration;
  titleKey: MessageKey;
  bodyKey: MessageKey;
};

export type FeaturesBlock = {
  type: "features-15";
  id: string;
  titleKey?: MessageKey;
  bodyKey?: MessageKey;
  items: readonly [FeatureItem, FeatureItem, FeatureItem];
};

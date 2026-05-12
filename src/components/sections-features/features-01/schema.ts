import type { MessageKey } from "@/types/messages";

export type FeatureIcon = "zap" | "settings" | "sparkles" | "shield" | "globe" | "users";

export type FeatureItem = {
  iconKey?: FeatureIcon;
  titleKey: MessageKey;
  bodyKey: MessageKey;
};

export type FeaturesBlock = {
  type: "features-01";
  id: string;
  titleKey?: MessageKey;
  bodyKey?: MessageKey;
  items: readonly FeatureItem[];
};

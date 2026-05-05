import type { MessageKey } from "@/types/messages";

export type FeatureIcon = "zap" | "settings" | "sparkles" | "shield" | "globe" | "users";

export type FeatureItem = {
  iconKey?: FeatureIcon;
  titleKey: MessageKey;
  bodyKey: MessageKey;
};

/**
 * Tailark `features-1` — 3-column card grid with a mask-gradient decorator
 * around each icon. Converted to the template pattern: props-driven content,
 * MessageKey-typed strings, theme tokens.
 */
export type FeaturesBlock = {
  type: "features-01";
  id: string;
  titleKey?: MessageKey;
  bodyKey?: MessageKey;
  items: readonly FeatureItem[];
};

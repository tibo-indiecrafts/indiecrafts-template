import type { MessageKey } from "@/types/messages";

export type FeaturesIcon =
  | "database"
  | "fingerprint"
  | "idCard"
  | "chartBar"
  | "zap"
  | "shield";

export type FeaturesItem = {
  id: string;
  icon: FeaturesIcon;
  labelKey: MessageKey;
  bodyKey: MessageKey;
  imageUrl: string;
  imageAltKey: MessageKey;
};

/**
 * Tailark `features-12` — centered heading, then a split accordion (left) +
 * animated image preview (right) that swaps as the active item changes.
 */
export type FeaturesBlock = {
  type: "features-12";
  id: string;
  titleKey?: MessageKey;
  bodyKey?: MessageKey;
  items: readonly FeaturesItem[];
};

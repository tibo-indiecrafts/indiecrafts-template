import type { MessageKey } from "@/types/messages";

/** Icon set for features-4 — includes extras (fingerprint, pencil) not in features-1. */
export type FeaturesIcon =
  | "zap"
  | "cpu"
  | "fingerprint"
  | "pencil"
  | "settings"
  | "sparkles"
  | "shield"
  | "users"
  | "globe";

export type FeaturesItem = {
  iconKey: FeaturesIcon;
  titleKey: MessageKey;
  bodyKey: MessageKey;
};

/**
 * Tailark `features-4` — 6-cell bordered grid of inline features, 2 rows × 3 columns.
 */
export type FeaturesBlock = {
  type: "features-04";
  id: string;
  titleKey?: MessageKey;
  bodyKey?: MessageKey;
  items: readonly FeaturesItem[];
};

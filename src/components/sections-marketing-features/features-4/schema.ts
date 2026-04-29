import type { MessageKey } from "@/types/messages";

/** Icon set for features-4 — includes extras (fingerprint, pencil) not in features-1. */
export type Features4Icon =
  | "zap"
  | "cpu"
  | "fingerprint"
  | "pencil"
  | "settings"
  | "sparkles"
  | "shield"
  | "users"
  | "globe";

export type Features4Item = {
  iconKey: Features4Icon;
  titleKey: MessageKey;
  bodyKey: MessageKey;
};

/**
 * Tailark `features-4` — 6-cell bordered grid of inline features, 2 rows × 3 columns.
 */
export type Features4Block = {
  type: "features-4";
  id: string;
  titleKey: MessageKey;
  bodyKey?: MessageKey;
  items: readonly Features4Item[];
};

import type { MessageKey } from "@/types/messages";

export type Features12Icon =
  | "database"
  | "fingerprint"
  | "idCard"
  | "chartBar"
  | "zap"
  | "shield";

export type Features12Item = {
  id: string;
  icon: Features12Icon;
  labelKey: MessageKey;
  bodyKey: MessageKey;
  imageUrl: string;
  imageAltKey: MessageKey;
};

/**
 * Tailark `features-12` — centered heading, then a split accordion (left) +
 * animated image preview (right) that swaps as the active item changes.
 */
export type Features12Block = {
  type: "features-12";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  items: readonly Features12Item[];
};

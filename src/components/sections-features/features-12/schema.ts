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

export type FeaturesBlock = {
  type: "features-12";
  id: string;
  titleKey?: MessageKey;
  bodyKey?: MessageKey;
  items: readonly FeaturesItem[];
};

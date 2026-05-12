import type { MessageKey } from "@/types/messages";

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

export type FeaturesBlock = {
  type: "features-04";
  id: string;
  titleKey?: MessageKey;
  bodyKey?: MessageKey;
  items: readonly FeaturesItem[];
};

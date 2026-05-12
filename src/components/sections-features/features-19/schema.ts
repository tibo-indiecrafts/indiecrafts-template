import type { MessageKey } from "@/types/messages";

export type StatIcon = "clock" | "zap" | "calendar";

export type StatItem = {
  iconKey: StatIcon;
  titleKey: MessageKey;
  bodyKey: MessageKey;
};

export type FeaturesBlock = {
  type: "features-19";
  id: string;
  titleKey?: MessageKey;
  bodyKey?: MessageKey;
  stats: readonly [StatItem, StatItem, StatItem];
};

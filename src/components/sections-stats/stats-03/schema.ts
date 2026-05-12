import type { MessageKey } from "@/types/messages";

export type StatsItem = {
  id: string;

  stat: string;
  change: string;
  changeType: "positive" | "negative";
};

export type StatsBlock = {
  type: "stats-03";
  id: string;
  titleKey?: MessageKey;
  items?: StatsItem[];
};

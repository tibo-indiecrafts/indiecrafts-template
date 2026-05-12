import type { MessageKey } from "@/types/messages";

export type StatsItem = {
  id: string;

  value: string;

  change: string;

  changeType: "positive" | "negative";
};

export type StatsBlock = {
  type: "stats-01";
  id: string;
  titleKey?: MessageKey;

  items?: StatsItem[];
};

import type { MessageKey } from "@/types/messages";

export type StatsItem = {
  id: string;
  value: string;
  change: string;
  changeType: "positive" | "negative";

  href: string;
};

export type StatsBlock = {
  type: "stats-05";
  id: string;
  titleKey?: MessageKey;
  items?: StatsItem[];
};

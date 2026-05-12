import type { MessageKey } from "@/types/messages";

export type StatsItem = {
  id: string;

  amount: number;

  percentage: number;

  color: "emerald" | "amber" | "rose";
};

export type StatsBlock = {
  type: "stats-14";
  id: string;
  titleKey?: MessageKey;

  total?: string;

  change?: string;

  settingsHref?: string;
  items?: StatsItem[];
};

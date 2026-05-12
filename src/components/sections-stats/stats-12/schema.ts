import type { MessageKey } from "@/types/messages";

export type StatsItem = {
  id: string;

  current: string;

  limit: string;

  percentage: number;
};

export type StatsBlock = {
  type: "stats-12";
  id: string;
  titleKey?: MessageKey;

  statusKey?: MessageKey;
  items?: StatsItem[];
};

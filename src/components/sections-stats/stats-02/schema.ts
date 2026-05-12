import type { MessageKey } from "@/types/messages";

export type StatsItem = {
  id: string;

  current: string;

  previous: string;

  difference: string;
  trend: "up" | "down";
};

export type StatsBlock = {
  type: "stats-02";
  id: string;
  titleKey?: MessageKey;
  items?: StatsItem[];
};

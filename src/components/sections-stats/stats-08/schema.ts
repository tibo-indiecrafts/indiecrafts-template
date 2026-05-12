import type { MessageKey } from "@/types/messages";

export type StatsItem = {
  id: string;

  progress: number;

  current: string;

  budget: string;

  href: string;

  fill: string;
};

export type StatsBlock = {
  type: "stats-08";
  id: string;
  titleKey?: MessageKey;
  items?: StatsItem[];
};

import type { MessageKey } from "@/types/messages";

export type StatsItem = {
  id: string;

  capacity: number;

  current: number;

  allowed: number;

  fill: string;
};

export type StatsBlock = {
  type: "stats-07";
  id: string;
  titleKey?: MessageKey;
  descriptionKey?: MessageKey;

  planName?: string;

  plansHref?: string;
  items?: StatsItem[];
};

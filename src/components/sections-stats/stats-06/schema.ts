import type { MessageKey } from "@/types/messages";

export type StatsStatus = "within" | "observe" | "critical";

export type StatsItem = {
  id: string;
  stat: string;
  goalsAchieved: number;
  goalsTotal: number;
  status: StatsStatus;

  href: string;
};

export type StatsBlock = {
  type: "stats-06";
  id: string;
  titleKey?: MessageKey;
  items?: StatsItem[];
};

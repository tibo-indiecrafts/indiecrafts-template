import type { MessageKey } from "@/types/messages";

export type StatsStatus = "within" | "observe" | "critical";

/**
 * Block from `@blocks-so/stats-06` — three region cards each with a
 * goal-progress sub-row and status pill (within / observe /
 * critical). Per-item copy keyed by `id` against `items.<id>.name`;
 * status copy under `status.<value>`.
 */
export type StatsItem = {
  id: string;
  stat: string;
  goalsAchieved: number;
  goalsTotal: number;
  status: StatsStatus;
  /** Drill-in link target. */
  href: string;
};

export type StatsBlock = {
  type: "stats-06";
  id: string;
  titleKey?: MessageKey;
  items?: StatsItem[];
};

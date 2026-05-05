import type { MessageKey } from "@/types/messages";

/**
 * Block from `@blocks-so/stats-03` — four-tile <dl> grid showing a
 * stat value with an inline change percentage. Per-item copy keyed
 * by `id` against `items.<id>.name`.
 */
export type StatsItem = {
  id: string;
  /** Pre-formatted stat value, e.g. `"10,450"`. */
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

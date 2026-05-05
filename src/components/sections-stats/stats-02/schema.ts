import type { MessageKey } from "@/types/messages";

/**
 * Block from `@blocks-so/stats-02` — three-column comparison row of
 * metric cards showing current vs previous values plus an up/down
 * trend badge. Per-item copy keyed by `id` against
 * `items.<id>.metric`.
 */
export type StatsItem = {
  id: string;
  /** Pre-formatted current value, e.g. `"128,456"`. */
  current: string;
  /** Pre-formatted previous value, e.g. `"115,789"`. */
  previous: string;
  /** Pre-formatted delta, e.g. `"10.9%"`. */
  difference: string;
  trend: "up" | "down";
};

export type StatsBlock = {
  type: "stats-02";
  id: string;
  titleKey?: MessageKey;
  items?: StatsItem[];
};

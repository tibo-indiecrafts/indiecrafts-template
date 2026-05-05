import type { MessageKey } from "@/types/messages";

/**
 * Block from `@blocks-so/stats-01` — joined-card row of metric tiles
 * with positive/negative change deltas. Per-item copy keyed by `id`
 * against `items.<id>.name`; numeric `value` + `change` stay as data.
 */
export type StatsItem = {
  /** Stable identifier — namespace key for `items.<id>.name`. */
  id: string;
  /** Pre-formatted display value, e.g. `"$287,654.00"`. */
  value: string;
  /** Pre-formatted delta string, e.g. `"+8.32%"`. */
  change: string;
  /** Drives the colour of the change badge. */
  changeType: "positive" | "negative";
};

export type StatsBlock = {
  type: "stats-01";
  id: string;
  titleKey?: MessageKey;
  /** Override the metric tiles. Defaults to `stats01Items`. */
  items?: StatsItem[];
};

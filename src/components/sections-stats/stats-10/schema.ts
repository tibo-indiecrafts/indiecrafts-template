import type { MessageKey } from "@/types/messages";

/**
 * Block from `@blocks-so/stats-10` — area-chart sparkline cards per
 * stock. Per-item copy keyed by `id` against `items.<id>.name` and
 * `items.<id>.tickerSymbol`. The 15-day data series is hardcoded
 * inside the component (chart data, not copy).
 */
export type StatsItem = {
  id: string;
  /** Pre-formatted current price, e.g. `"$168.59"`. */
  value: string;
  /** Pre-formatted absolute change, e.g. `"+15.86"`. */
  change: string;
  /** Pre-formatted percentage change, e.g. `"+10.4%"`. */
  percentageChange: string;
  changeType: "positive" | "negative";
};

export type StatsBlock = {
  type: "stats-10";
  id: string;
  titleKey?: MessageKey;
  items?: StatsItem[];
};

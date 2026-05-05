import type { MessageKey } from "@/types/messages";

/**
 * Block from `@blocks-so/stats-12` — donut-list usage card with 10
 * usage rows and an upgrade CTA. Per-row copy keyed by `id` against
 * `items.<id>.name`; numeric current/limit/percentage stay as data.
 */
export type StatsItem = {
  id: string;
  /** Pre-formatted current value, e.g. `"358K"`. */
  current: string;
  /** Pre-formatted limit, e.g. `"1M"`. */
  limit: string;
  /** 0–100 — drives the donut fill ratio. */
  percentage: number;
};

export type StatsBlock = {
  type: "stats-12";
  id: string;
  titleKey?: MessageKey;
  /** Short status line under the title. */
  statusKey?: MessageKey;
  items?: StatsItem[];
};

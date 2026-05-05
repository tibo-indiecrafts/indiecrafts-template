import type { MessageKey } from "@/types/messages";

/**
 * Block from `@blocks-so/stats-15` — investment growth projection
 * list (1y / 5y / 10y rows) with value + percentage badge per row.
 * Per-row copy keyed by `id` against `items.<id>.label`.
 */
export type ProjectionItem = {
  id: string;
  /** Pre-formatted projected value, e.g. `"$2,400"`. */
  value: string;
  /** Pre-formatted percentage badge, e.g. `"+8.2%"`. */
  percentage: string;
};

export type ProjectionBlock = {
  type: "stats-15";
  id: string;
  titleKey?: MessageKey;
  items?: ProjectionItem[];
};

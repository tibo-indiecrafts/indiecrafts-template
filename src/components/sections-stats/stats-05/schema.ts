import type { MessageKey } from "@/types/messages";

/**
 * Block from `@blocks-so/stats-05` — three metric cards each with a
 * footer link to drill in. Per-item copy keyed by `id` against
 * `items.<id>.name`.
 */
export type StatsItem = {
  id: string;
  value: string;
  change: string;
  changeType: "positive" | "negative";
  /** Drill-in link target. Plain href, defaults to `#`. */
  href: string;
};

export type StatsBlock = {
  type: "stats-05";
  id: string;
  titleKey?: MessageKey;
  items?: StatsItem[];
};

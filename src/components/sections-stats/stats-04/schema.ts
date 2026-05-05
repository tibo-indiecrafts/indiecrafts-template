import type { MessageKey } from "@/types/messages";

/**
 * Block from `@blocks-so/stats-04` — three-tile `<dl>` grid with a
 * trend badge in the corner of each card. Per-item copy keyed by
 * `id` against `items.<id>.name`.
 */
export type StatsItem = {
  id: string;
  stat: string;
  change: string;
  changeType: "positive" | "negative";
};

export type StatsBlock = {
  type: "stats-04";
  id: string;
  titleKey?: MessageKey;
  items?: StatsItem[];
};

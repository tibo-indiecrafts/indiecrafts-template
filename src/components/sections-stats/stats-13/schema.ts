import type { MessageKey } from "@/types/messages";

/**
 * Block from `@blocks-so/stats-13` — segmented storage progress bar
 * with per-segment legend and a "Free" remainder. Per-segment copy
 * keyed by `id` against `segments.<id>.label`.
 */
export type StatsSegment = {
  id: string;
  /** Numeric value in `usedUnit` units (e.g. 2400 MB). */
  value: number;
  /** Tailwind background colour class for the bar slice + legend dot. */
  color: string;
};

export type StatsBlock = {
  type: "stats-13";
  id: string;
  titleKey?: MessageKey;
  /** Used amount in `usedUnit` units, e.g. 8300. */
  used?: number;
  /** Total in `totalUnit` units (multiplied by 1000 to convert), e.g. 15. */
  total?: number;
  /** Display unit label for `used`, e.g. `"MB"`. */
  usedUnit?: string;
  /** Display unit label for `total`, e.g. `"GB"`. */
  totalUnit?: string;
  segments?: StatsSegment[];
};

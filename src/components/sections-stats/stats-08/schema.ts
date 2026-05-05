import type { MessageKey } from "@/types/messages";

/**
 * Block from `@blocks-so/stats-08` — radial-bar budget cards with a
 * footer drill-in link. Per-item copy keyed by `id` against
 * `items.<id>.name`.
 */
export type StatsItem = {
  id: string;
  /** 0–100 — drives the radial bar fill. */
  progress: number;
  /** Pre-formatted current spend, e.g. `"$250"`. */
  current: string;
  /** Pre-formatted budget cap, e.g. `"$1,000"`. */
  budget: string;
  /** Drill-in link target. */
  href: string;
  /** Recharts fill colour, e.g. `"var(--chart-1)"`. */
  fill: string;
};

export type StatsBlock = {
  type: "stats-08";
  id: string;
  titleKey?: MessageKey;
  items?: StatsItem[];
};

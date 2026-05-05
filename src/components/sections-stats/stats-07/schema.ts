import type { MessageKey } from "@/types/messages";

/**
 * Block from `@blocks-so/stats-07` — radial-bar plan-overview cards
 * showing capacity utilization. Per-item copy keyed by `id` against
 * `items.<id>.name`.
 */
export type StatsItem = {
  id: string;
  /** 0–100 — drives the radial bar fill. */
  capacity: number;
  /** Current units consumed, e.g. `1`. */
  current: number;
  /** Plan limit, e.g. `5`. */
  allowed: number;
  /** Recharts fill colour, e.g. `"var(--chart-1)"`. */
  fill: string;
};

export type StatsBlock = {
  type: "stats-07";
  id: string;
  titleKey?: MessageKey;
  descriptionKey?: MessageKey;
  /** Plan name to interpolate into the description. */
  planName?: string;
  /** Drill-in link for "view other plans". Plain href, defaults to `#`. */
  plansHref?: string;
  items?: StatsItem[];
};

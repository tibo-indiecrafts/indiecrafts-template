import type { MessageKey } from "@/types/messages";

/**
 * Block from `@blocks-so/stats-14` — single usage card with stacked
 * resource breakdown bar + per-resource legend list. Per-row copy
 * keyed by `id` against `items.<id>.label`.
 */
export type StatsItem = {
  id: string;
  /** Pre-formatted dollar amount, e.g. `450`. */
  amount: number;
  /** 0–100 — drives bar slice + legend percentage. */
  percentage: number;
  /** Tailwind colour key, mapped to bg classes inside the component. */
  color: "emerald" | "amber" | "rose";
};

export type StatsBlock = {
  type: "stats-14";
  id: string;
  titleKey?: MessageKey;
  /** Pre-formatted total spend, e.g. `"$860"`. */
  total?: string;
  /** Pre-formatted change badge, e.g. `"+12.5%"`. */
  change?: string;
  /** Drill-in href for "resource settings". Plain href, defaults to `#`. */
  settingsHref?: string;
  items?: StatsItem[];
};

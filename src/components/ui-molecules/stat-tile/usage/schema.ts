import type { MessageKey } from "@/types/messages";

/**
 * Block from `@blocks-so/stats-09` — usage cards with linear progress
 * bars showing consumption vs limit. Per-item copy keyed by `id`
 * against `items.<id>.name`.
 */
export type UsageItem = {
  id: string;
  /** Pre-formatted current value, e.g. `"996"`. */
  stat: string;
  /** Pre-formatted limit, e.g. `"10,000"`. */
  limit: string;
  /** 0–100 — drives the progress bar fill. */
  percentage: number;
};

export type UsageBlock = {
  type: "stats-09";
  id: string;
  titleKey?: MessageKey;
  items?: UsageItem[];
};

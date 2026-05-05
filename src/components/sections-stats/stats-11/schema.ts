import type { MessageKey } from "@/types/messages";

/**
 * Block from `@blocks-so/stats-11` — composite four-card resource
 * dashboard (Commands / Bandwidth / Storage / Cost) with an embedded
 * "update budget" dialog. Numeric values stay as data; all labels
 * resolve through `blocks.stats-11.*`.
 */
export type StatsBlock = {
  type: "stats-11";
  id: string;
  titleKey?: MessageKey;
  /** Pre-formatted commands count, e.g. `"13.8M"`. */
  commandsValue?: string;
  /** Pre-formatted commands progress (0–100). */
  commandsPercentage?: number;
  /** Pre-formatted writes count for the breakdown row. */
  commandsWrites?: string;
  /** Pre-formatted reads count for the breakdown row. */
  commandsReads?: string;
  /** Pre-formatted bandwidth value, e.g. `"141 GB"`. */
  bandwidthValue?: string;
  /** Pre-formatted bandwidth limit, e.g. `"150 GB"`. */
  bandwidthLimit?: string;
  /** 0–100. */
  bandwidthPercentage?: number;
  /** Pre-formatted storage value, e.g. `"37 GB"`. */
  storageValue?: string;
  /** Pre-formatted storage limit, e.g. `"500 GB"`. */
  storageLimit?: string;
  /** 0–100. */
  storagePercentage?: number;
  /** Pre-formatted cost value, e.g. `"$73.42"`. */
  costValue?: string;
  /** 0–100. */
  costPercentage?: number;
  /** Initial budget value used in the dialog input. */
  initialBudget?: string;
};

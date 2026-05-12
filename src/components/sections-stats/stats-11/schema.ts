import type { MessageKey } from "@/types/messages";

export type StatsBlock = {
  type: "stats-11";
  id: string;
  titleKey?: MessageKey;

  commandsValue?: string;

  commandsPercentage?: number;

  commandsWrites?: string;

  commandsReads?: string;

  bandwidthValue?: string;

  bandwidthLimit?: string;

  bandwidthPercentage?: number;

  storageValue?: string;

  storageLimit?: string;

  storagePercentage?: number;

  costValue?: string;

  costPercentage?: number;

  initialBudget?: string;
};

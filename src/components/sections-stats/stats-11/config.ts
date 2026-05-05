import type { StatsBlock } from "./schema";

export const stats11Key = "stats-11" as const;
export const stats11Namespace = "blocks.stats-11" as const;

export const stats11Sample: Omit<StatsBlock, "id"> = {
  type: "stats-11",
  commandsValue: "13.8M",
  commandsPercentage: 67,
  commandsWrites: "11,276,493",
  commandsReads: "2,548,921",
  bandwidthValue: "141 GB",
  bandwidthLimit: "150 GB",
  bandwidthPercentage: 94,
  storageValue: "37 GB",
  storageLimit: "500 GB",
  storagePercentage: 7.4,
  costValue: "$73.42",
  costPercentage: 48.95,
  initialBudget: "150",
};

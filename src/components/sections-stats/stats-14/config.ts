import type { StatsBlock, StatsItem } from "./schema";

export const stats14Key = "stats-14" as const;
export const stats14Namespace = "blocks.stats-14" as const;

export const stats14Items: StatsItem[] = [
  { id: "compute", amount: 450, percentage: 52.3, color: "emerald" },
  { id: "storage", amount: 285, percentage: 33.1, color: "amber" },
  { id: "bandwidth", amount: 125, percentage: 14.6, color: "rose" },
];

export const stats14Sample: Omit<StatsBlock, "id"> = {
  type: "stats-14",
  total: "$860",
  change: "+12.5%",
  items: stats14Items,
};

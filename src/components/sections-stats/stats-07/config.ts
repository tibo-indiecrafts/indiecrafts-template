import type { StatsBlock, StatsItem } from "./schema";

export const stats07Key = "stats-07" as const;
export const stats07Namespace = "blocks.stats-07" as const;

export const stats07Items: StatsItem[] = [
  { id: "workspaces", capacity: 20, current: 1, allowed: 5, fill: "var(--chart-1)" },
  { id: "dashboards", capacity: 10, current: 2, allowed: 20, fill: "var(--chart-2)" },
  { id: "chart-widgets", capacity: 30, current: 15, allowed: 50, fill: "var(--chart-3)" },
  { id: "storage", capacity: 50, current: 25, allowed: 100, fill: "var(--chart-4)" },
];

export const stats07Sample: Omit<StatsBlock, "id"> = {
  type: "stats-07",
  items: stats07Items,
};

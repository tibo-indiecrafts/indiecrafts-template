import type { StatsBlock, StatsItem } from "./schema";

export const stats02Key = "stats-02" as const;
export const stats02Namespace = "blocks.stats-02" as const;

export const stats02Items: StatsItem[] = [
  {
    id: "active-users",
    current: "128,456",
    previous: "115,789",
    difference: "10.9%",
    trend: "up",
  },
  {
    id: "conversion-rate",
    current: "5.32%",
    previous: "6.18%",
    difference: "0.86%",
    trend: "down",
  },
  {
    id: "avg-session",
    current: "3m 42s",
    previous: "3m 15s",
    difference: "13.8%",
    trend: "up",
  },
];

export const stats02Sample: Omit<StatsBlock, "id"> = {
  type: "stats-02",
  items: stats02Items,
};

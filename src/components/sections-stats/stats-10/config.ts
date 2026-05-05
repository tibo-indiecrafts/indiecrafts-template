import type { StatsBlock, StatsItem } from "./schema";

export const stats10Key = "stats-10" as const;
export const stats10Namespace = "blocks.stats-10" as const;

export const stats10Items: StatsItem[] = [
  {
    id: "alpha",
    value: "$168.59",
    change: "+15.86",
    percentageChange: "+10.4%",
    changeType: "positive",
  },
  {
    id: "beta",
    value: "$78.54",
    change: "+4.65",
    percentageChange: "+6.3%",
    changeType: "positive",
  },
  {
    id: "gamma",
    value: "$75.68",
    change: "-5.74",
    percentageChange: "-7.1%",
    changeType: "negative",
  },
];

export const stats10Sample: Omit<StatsBlock, "id"> = {
  type: "stats-10",
  items: stats10Items,
};

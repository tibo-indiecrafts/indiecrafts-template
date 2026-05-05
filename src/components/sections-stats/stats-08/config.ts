import type { StatsBlock, StatsItem } from "./schema";

export const stats08Key = "stats-08" as const;
export const stats08Namespace = "blocks.stats-08" as const;

export const stats08Items: StatsItem[] = [
  {
    id: "hr",
    progress: 25,
    budget: "$1,000",
    current: "$250",
    href: "#",
    fill: "var(--chart-1)",
  },
  {
    id: "marketing",
    progress: 55,
    budget: "$1,000",
    current: "$550",
    href: "#",
    fill: "var(--chart-2)",
  },
  {
    id: "finance",
    progress: 85,
    budget: "$1,000",
    current: "$850",
    href: "#",
    fill: "var(--chart-3)",
  },
  {
    id: "engineering",
    progress: 70,
    budget: "$2,000",
    current: "$1,400",
    href: "#",
    fill: "var(--chart-4)",
  },
];

export const stats08Sample: Omit<StatsBlock, "id"> = {
  type: "stats-08",
  items: stats08Items,
};

import type { StatsBlock, StatsItem } from "./schema";

export const stats06Key = "stats-06" as const;
export const stats06Namespace = "blocks.stats-06" as const;

export const stats06Items: StatsItem[] = [
  {
    id: "europe",
    stat: "$10,023",
    goalsAchieved: 3,
    goalsTotal: 5,
    status: "observe",
    href: "#",
  },
  {
    id: "north-america",
    stat: "$14,092",
    goalsAchieved: 5,
    goalsTotal: 5,
    status: "within",
    href: "#",
  },
  {
    id: "asia",
    stat: "$113,232",
    goalsAchieved: 1,
    goalsTotal: 5,
    status: "critical",
    href: "#",
  },
];

export const stats06Sample: Omit<StatsBlock, "id"> = {
  type: "stats-06",
  items: stats06Items,
};

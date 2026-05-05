import type { StatsBlock, StatsItem } from "./schema";

export const stats05Key = "stats-05" as const;
export const stats05Namespace = "blocks.stats-05" as const;

export const stats05Items: StatsItem[] = [
  { id: "mrr", value: "$34.1K", change: "+6.1%", changeType: "positive", href: "#" },
  { id: "users", value: "500.1K", change: "+19.2%", changeType: "positive", href: "#" },
  {
    id: "user-growth",
    value: "11.3%",
    change: "-1.2%",
    changeType: "negative",
    href: "#",
  },
];

export const stats05Sample: Omit<StatsBlock, "id"> = {
  type: "stats-05",
  items: stats05Items,
};

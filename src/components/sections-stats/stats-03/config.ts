import type { StatsBlock, StatsItem } from "./schema";

export const stats03Key = "stats-03" as const;
export const stats03Namespace = "blocks.stats-03" as const;

export const stats03Items: StatsItem[] = [
  { id: "unique-visitors", stat: "10,450", change: "-12.5%", changeType: "negative" },
  { id: "bounce-rate", stat: "56.1%", change: "+1.8%", changeType: "positive" },
  { id: "visit-duration", stat: "5.2min", change: "+19.7%", changeType: "positive" },
  { id: "conversion-rate", stat: "3.2%", change: "-2.4%", changeType: "negative" },
];

export const stats03Sample: Omit<StatsBlock, "id"> = {
  type: "stats-03",
  items: stats03Items,
};

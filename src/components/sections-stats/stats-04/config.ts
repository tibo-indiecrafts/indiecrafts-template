import type { StatsBlock, StatsItem } from "./schema";

export const stats04Key = "stats-04" as const;
export const stats04Namespace = "blocks.stats-04" as const;

export const stats04Items: StatsItem[] = [
  { id: "daily-active", stat: "3,450", change: "+12.1%", changeType: "positive" },
  { id: "weekly-sessions", stat: "1,342", change: "-9.8%", changeType: "negative" },
  { id: "duration", stat: "5.2min", change: "+7.7%", changeType: "positive" },
];

export const stats04Sample: Omit<StatsBlock, "id"> = {
  type: "stats-04",
  items: stats04Items,
};

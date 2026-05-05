import type { StatsBlock, StatsItem } from "./schema";

export const stats01Key = "stats-01" as const;
export const stats01Namespace = "blocks.stats-01" as const;

export const stats01Items: StatsItem[] = [
  { id: "profit", value: "$287,654.00", change: "+8.32%", changeType: "positive" },
  { id: "late-payments", value: "$9,435.00", change: "-12.64%", changeType: "negative" },
  {
    id: "pending-orders",
    value: "$173,229.00",
    change: "+2.87%",
    changeType: "positive",
  },
  {
    id: "operating-costs",
    value: "$52,891.00",
    change: "-5.73%",
    changeType: "negative",
  },
];

export const stats01Sample: Omit<StatsBlock, "id"> = {
  type: "stats-01",
  items: stats01Items,
};

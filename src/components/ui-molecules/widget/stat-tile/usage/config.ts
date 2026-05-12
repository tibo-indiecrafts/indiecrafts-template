import type { UsageBlock, UsageItem } from "./schema";

export const stats09Key = "stats-09" as const;
export const stats09Namespace = "blocks.stats-09" as const;

export const stats09Items: UsageItem[] = [
  { id: "requests", stat: "996", limit: "10,000", percentage: 9.96 },
  { id: "credits", stat: "$672", limit: "$1,000", percentage: 67.2 },
  { id: "storage", stat: "1.85", limit: "10GB", percentage: 18.5 },
  { id: "api-calls", stat: "4,328", limit: "5,000", percentage: 86.56 },
];

export const stats09Sample: Omit<UsageBlock, "id"> = {
  type: "stats-09",
  items: stats09Items,
};

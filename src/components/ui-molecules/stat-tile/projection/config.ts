import type { ProjectionBlock, ProjectionItem } from "./schema";

export const stats15Key = "stats-15" as const;
export const stats15Namespace = "blocks.stats-15" as const;

export const stats15Items: ProjectionItem[] = [
  { id: "year-1", value: "$2,400", percentage: "+8.2%" },
  { id: "year-5", value: "$14,800", percentage: "+24.6%" },
  { id: "year-10", value: "$38,500", percentage: "+52.1%" },
];

export const stats15Sample: Omit<ProjectionBlock, "id"> = {
  type: "stats-15",
  items: stats15Items,
};

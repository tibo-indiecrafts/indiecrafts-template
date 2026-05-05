import type { StatsBlock, StatsSegment } from "./schema";

export const stats13Key = "stats-13" as const;
export const stats13Namespace = "blocks.stats-13" as const;

export const stats13Segments: StatsSegment[] = [
  { id: "documents", value: 2400, color: "bg-blue-500" },
  { id: "photos", value: 1800, color: "bg-emerald-500" },
  { id: "videos", value: 3200, color: "bg-amber-500" },
  { id: "music", value: 900, color: "bg-purple-500" },
];

export const stats13Sample: Omit<StatsBlock, "id"> = {
  type: "stats-13",
  used: 8300,
  total: 15,
  usedUnit: "MB",
  totalUnit: "GB",
  segments: stats13Segments,
};

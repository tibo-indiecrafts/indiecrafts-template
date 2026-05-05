import type { StatsBlock, StatsItem } from "./schema";

export const stats12Key = "stats-12" as const;
export const stats12Namespace = "blocks.stats-12" as const;

export const stats12Items: StatsItem[] = [
  { id: "isr-reads", current: "358K", limit: "1M", percentage: 35.8 },
  { id: "edge-requests", current: "317K", limit: "1M", percentage: 31.7 },
  { id: "fast-origin-transfer", current: "3.07 GB", limit: "10 GB", percentage: 30.7 },
  { id: "speed-insights", current: "791", limit: "10K", percentage: 7.9 },
  { id: "fast-data-transfer", current: "4.98 GB", limit: "100 GB", percentage: 5.0 },
  {
    id: "function-duration",
    current: "3.1 GB-Hrs",
    limit: "100 GB-Hrs",
    percentage: 3.1,
  },
  { id: "web-analytics", current: "1.3K", limit: "50K", percentage: 2.6 },
  { id: "isr-writes", current: "4.8K", limit: "200K", percentage: 2.4 },
  { id: "function-invocations", current: "19K", limit: "1M", percentage: 1.9 },
  { id: "image-cache-reads", current: "4.3K", limit: "300K", percentage: 1.4 },
];

export const stats12Sample: Omit<StatsBlock, "id"> = {
  type: "stats-12",
  items: stats12Items,
};

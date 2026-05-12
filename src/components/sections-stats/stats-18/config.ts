import type { StatsBlock } from "./schema";

export const stats18Key = "stats-18" as const;
export const stats18Namespace = "blocks.stats-18" as const;

export const stats18Sample: Omit<StatsBlock, "id"> = {
  type: "stats-18",
  items: [
    {
      valueKey: "blocks.stats-18.items.1.value",
      bodyKey: "blocks.stats-18.items.1.body",
    },
    {
      valueKey: "blocks.stats-18.items.2.value",
      bodyKey: "blocks.stats-18.items.2.body",
    },
    {
      valueKey: "blocks.stats-18.items.3.value",
      bodyKey: "blocks.stats-18.items.3.body",
    },
  ],
};

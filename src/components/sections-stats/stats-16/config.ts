import type { StatsBlock } from "./schema";

export const stats16Key = "stats-16" as const;
export const stats16Namespace = "blocks.stats-16" as const;

export const stats16Sample: Omit<StatsBlock, "id"> = {
  type: "stats-16",
  items: [
    {
      valueKey: "blocks.stats-16.items.item1.value",
      suffixKey: "blocks.stats-16.items.item1.suffix",
      bodyKey: "blocks.stats-16.items.item1.body",
    },
    {
      valueKey: "blocks.stats-16.items.item2.value",
      bodyKey: "blocks.stats-16.items.item2.body",
    },
    {
      valueKey: "blocks.stats-16.items.item3.value",
      suffixKey: "blocks.stats-16.items.item3.suffix",
      bodyKey: "blocks.stats-16.items.item3.body",
    },
  ],
};

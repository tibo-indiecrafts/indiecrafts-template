import type { StatsBlock } from "./schema";

export const stats17Key = "stats-17" as const;
export const stats17Namespace = "blocks.stats-17" as const;

export const stats17Sample: Omit<StatsBlock, "id"> = {
  type: "stats-17",
  titleKey: "blocks.stats-17.title",
  bodyKey: "blocks.stats-17.body",
  items: [
    {
      valueKey: "blocks.stats-17.items.1.value",
      bodyKey: "blocks.stats-17.items.1.body",
    },
    {
      valueKey: "blocks.stats-17.items.2.value",
      bodyKey: "blocks.stats-17.items.2.body",
    },
    {
      valueKey: "blocks.stats-17.items.3.value",
      bodyKey: "blocks.stats-17.items.3.body",
    },
  ],
};

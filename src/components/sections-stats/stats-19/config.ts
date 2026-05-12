import type { StatsBlock } from "./schema";

export const stats19Key = "stats-19" as const;
export const stats19Namespace = "blocks.stats-19" as const;

export const stats19Sample: Omit<StatsBlock, "id"> = {
  type: "stats-19",
  titleKey: "blocks.stats-19.title",
  bodyKey: "blocks.stats-19.body",
  items: [
    {
      valueKey: "blocks.stats-19.items.1.value",
      trailingKey: "blocks.stats-19.items.1.trailing",
    },
    {
      valueKey: "blocks.stats-19.items.2.value",
      trailingKey: "blocks.stats-19.items.2.trailing",
    },
    {
      valueKey: "blocks.stats-19.items.3.value",
      trailingKey: "blocks.stats-19.items.3.trailing",
    },
  ],
};

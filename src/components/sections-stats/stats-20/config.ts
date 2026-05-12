import type { StatsBlock } from "./schema";

export const stats20Key = "stats-20" as const;
export const stats20Namespace = "blocks.stats-20" as const;

export const stats20Sample: Omit<StatsBlock, "id"> = {
  type: "stats-20",
  titleKey: "blocks.stats-20.title",
  bodyKey: "blocks.stats-20.body",
  globeSrc:
    "https://images.unsplash.com/photo-1723307060937-b003478a2c03?q=80&w=2928&auto=format&fit=crop",
  items: [
    {
      valueKey: "blocks.stats-20.items.1.value",
      trailingKey: "blocks.stats-20.items.1.trailing",
    },
    {
      valueKey: "blocks.stats-20.items.2.value",
      trailingKey: "blocks.stats-20.items.2.trailing",
    },
    {
      valueKey: "blocks.stats-20.items.3.value",
      trailingKey: "blocks.stats-20.items.3.trailing",
    },
  ],
};

import type { Stats4Block } from "./schema";

export const stats4Sample: Omit<Stats4Block, "id"> = {
  type: "stats-4",
  titleKey: "blocks.stats-4.title",
  leadKey: "blocks.stats-4.lead",
  supportingKey: "blocks.stats-4.supporting",
  items: [
    {
      valueKey: "blocks.stats-4.items.stars.value",
      labelKey: "blocks.stats-4.items.stars.label",
    },
    {
      valueKey: "blocks.stats-4.items.apps.value",
      labelKey: "blocks.stats-4.items.apps.label",
    },
  ],
  quoteKey: "blocks.stats-4.quote",
  authorKey: "blocks.stats-4.author",
};

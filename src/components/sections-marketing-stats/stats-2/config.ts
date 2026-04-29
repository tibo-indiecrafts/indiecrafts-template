import type { Stats2Block } from "./schema";

export const stats2Sample: Omit<Stats2Block, "id"> = {
  type: "stats-2",
  titleKey: "blocks.stats-2.title",
  introKey: "blocks.stats-2.intro",
  items: [
    {
      valueKey: "blocks.stats-2.items.stars.value",
      labelKey: "blocks.stats-2.items.stars.label",
    },
    {
      valueKey: "blocks.stats-2.items.conversion.value",
      labelKey: "blocks.stats-2.items.conversion.label",
    },
    {
      valueKey: "blocks.stats-2.items.apps.value",
      labelKey: "blocks.stats-2.items.apps.label",
    },
  ],
};

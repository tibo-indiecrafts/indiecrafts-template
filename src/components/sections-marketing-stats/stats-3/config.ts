import type { Stats3Block } from "./schema";

export const stats3Sample: Omit<Stats3Block, "id"> = {
  type: "stats-3",
  titleKey: "blocks.stats-3.title",
  introKey: "blocks.stats-3.intro",
  items: [
    {
      valueKey: "blocks.stats-3.items.stars.value",
      labelKey: "blocks.stats-3.items.stars.label",
    },
    {
      valueKey: "blocks.stats-3.items.conversion.value",
      labelKey: "blocks.stats-3.items.conversion.label",
    },
    {
      valueKey: "blocks.stats-3.items.apps.value",
      labelKey: "blocks.stats-3.items.apps.label",
    },
  ],
};

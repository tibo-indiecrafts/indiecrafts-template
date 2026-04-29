import type { Stats1Block } from "./schema";

/**
 * Default stats-1 instance. Numeric values are translated (kept as
 * MessageKeys) so copy like `+1 200` can render with locale-appropriate
 * separators via `messages/<locale>.json`.
 */
export const stats1Sample: Omit<Stats1Block, "id"> = {
  type: "stats-1",
  titleKey: "blocks.stats-1.title",
  introKey: "blocks.stats-1.intro",
  items: [
    {
      valueKey: "blocks.stats-1.items.stars.value",
      labelKey: "blocks.stats-1.items.stars.label",
    },
    {
      valueKey: "blocks.stats-1.items.users.value",
      labelKey: "blocks.stats-1.items.users.label",
    },
    {
      valueKey: "blocks.stats-1.items.apps.value",
      labelKey: "blocks.stats-1.items.apps.label",
    },
  ],
};

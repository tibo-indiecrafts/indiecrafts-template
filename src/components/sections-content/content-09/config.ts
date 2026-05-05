import type { ContentBlock } from "./schema";

export const content09Key = "content-09" as const;
export const content09Namespace = "blocks.content-09" as const;

export const content09Sample: Omit<ContentBlock, "id"> = {
  type: "content-09",
  titleKey: "blocks.content-09.title",
  leadKey: "blocks.content-09.lead",
  supportingKey: "blocks.content-09.supporting",
  items: [
    {
      valueKey: "blocks.content-09.items.stars.value",
      labelKey: "blocks.content-09.items.stars.label",
    },
    {
      valueKey: "blocks.content-09.items.apps.value",
      labelKey: "blocks.content-09.items.apps.label",
    },
  ],
  quoteKey: "blocks.content-09.quote",
  authorKey: "blocks.content-09.author",
};

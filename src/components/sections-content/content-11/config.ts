import type { ContentBlock } from "./schema";

export const content11Key = "content-11" as const;
export const content11Namespace = "blocks.content-11" as const;

export const content11Sample: Omit<ContentBlock, "id"> = {
  type: "content-11",
  titleKey: "blocks.content-11.title",
  introKey: "blocks.content-11.intro",
  items: [
    {
      valueKey: "blocks.content-11.items.stars.value",
      labelKey: "blocks.content-11.items.stars.label",
    },
    {
      valueKey: "blocks.content-11.items.conversion.value",
      labelKey: "blocks.content-11.items.conversion.label",
    },
    {
      valueKey: "blocks.content-11.items.apps.value",
      labelKey: "blocks.content-11.items.apps.label",
    },
  ],
};

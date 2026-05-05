import type { ContentBlock } from "./schema";

export const content10Key = "content-10" as const;
export const content10Namespace = "blocks.content-10" as const;

export const content10Sample: Omit<ContentBlock, "id"> = {
  type: "content-10",
  titleKey: "blocks.content-10.title",
  introKey: "blocks.content-10.intro",
  items: [
    {
      valueKey: "blocks.content-10.items.stars.value",
      labelKey: "blocks.content-10.items.stars.label",
    },
    {
      valueKey: "blocks.content-10.items.conversion.value",
      labelKey: "blocks.content-10.items.conversion.label",
    },
    {
      valueKey: "blocks.content-10.items.apps.value",
      labelKey: "blocks.content-10.items.apps.label",
    },
  ],
};

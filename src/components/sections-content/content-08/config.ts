import type { ContentBlock } from "./schema";

export const content08Key = "content-08" as const;
export const content08Namespace = "blocks.content-08" as const;

export const content08Sample: Omit<ContentBlock, "id"> = {
  type: "content-08",
  titleKey: "blocks.content-08.title",
  introKey: "blocks.content-08.intro",
  items: [
    {
      valueKey: "blocks.content-08.items.stars.value",
      labelKey: "blocks.content-08.items.stars.label",
    },
    {
      valueKey: "blocks.content-08.items.users.value",
      labelKey: "blocks.content-08.items.users.label",
    },
    {
      valueKey: "blocks.content-08.items.apps.value",
      labelKey: "blocks.content-08.items.apps.label",
    },
  ],
};

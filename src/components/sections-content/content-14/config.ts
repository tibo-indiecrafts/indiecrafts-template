import type { ContentBlock } from "./schema";

export const content14Key = "content-14" as const;
export const content14Namespace = "blocks.content-14" as const;

export const content14Sample: Omit<ContentBlock, "id"> = {
  type: "content-14",
  items: [
    {
      titleKey: "blocks.content-14.items.item1.title",
      bodyKey: "blocks.content-14.items.item1.body",
      altKey: "blocks.content-14.items.item1.alt",
      image: {
        src: "https://raw.githubusercontent.com/acme/assets/refs/heads/main/time_djv8te.webp",
        width: 1278,
        height: 900,
      },
    },
    {
      titleKey: "blocks.content-14.items.item2.title",
      bodyKey: "blocks.content-14.items.item2.body",
      altKey: "blocks.content-14.items.item2.alt",
      image: {
        src: "https://raw.githubusercontent.com/acme/assets/refs/heads/main/dots-2_kmiukp.webp",
        width: 1388,
        height: 1388,
      },
    },
  ],
};

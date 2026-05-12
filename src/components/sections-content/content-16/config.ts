import type { ContentBlock } from "./schema";

export const content16Key = "content-16" as const;
export const content16Namespace = "blocks.content-16" as const;

export const content16Sample: Omit<ContentBlock, "id"> = {
  type: "content-16",
  titleKey: "blocks.content-16.title",
  bodyKey: "blocks.content-16.body",
  image: {
    src: "https://raw.githubusercontent.com/tailark/assets/refs/heads/main/ai-human-2_uo6bxc.jpg",
    width: 5001,
    height: 3334,
    altKey: "blocks.content-16.imageAlt",
  },
};

import type { ContentBlock } from "./schema";

export const content17Key = "content-17" as const;
export const content17Namespace = "blocks.content-17" as const;

export const content17Sample: Omit<ContentBlock, "id"> = {
  type: "content-17",
  titleKey: "blocks.content-17.title",
  bodyKeys: ["blocks.content-17.paragraphs.p1", "blocks.content-17.paragraphs.p2"],
  image: {
    src: "https://raw.githubusercontent.com/tailark/assets/refs/heads/main/dots-pattern_yfnqcy.jpg",
    width: 6394,
    height: 4500,
    altKey: "blocks.content-17.imageAlt",
  },
};

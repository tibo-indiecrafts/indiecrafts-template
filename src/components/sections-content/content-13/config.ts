import type { ContentBlock } from "./schema";

export const content13Key = "content-13" as const;
export const content13Namespace = "blocks.content-13" as const;

export const content13Sample: Omit<ContentBlock, "id"> = {
  type: "content-13",
  paragraphKeys: [
    "blocks.content-13.paragraphs.p1",
    "blocks.content-13.paragraphs.p2",
    "blocks.content-13.paragraphs.p3",
    "blocks.content-13.paragraphs.p4",
    "blocks.content-13.paragraphs.p5",
  ],
  author: {
    avatarUrl: "https://avatars.githubusercontent.com/u/47919550?v=4",
    nameKey: "blocks.content-13.author.name",
    roleKey: "blocks.content-13.author.role",
  },
};

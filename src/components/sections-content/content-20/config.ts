import type { ContentBlock } from "./schema";

export const content20Key = "content-20" as const;
export const content20Namespace = "blocks.content-20" as const;

export const content20Sample: Omit<ContentBlock, "id"> = {
  type: "content-20",
  paragraphKeys: [
    "blocks.content-20.paragraphs.p1",
    "blocks.content-20.paragraphs.p2",
    "blocks.content-20.paragraphs.p3",
    "blocks.content-20.paragraphs.p4",
    "blocks.content-20.paragraphs.p5",
  ],
  readMoreLabelKey: "blocks.content-20.readMore",
  readLessLabelKey: "blocks.content-20.readLess",
};

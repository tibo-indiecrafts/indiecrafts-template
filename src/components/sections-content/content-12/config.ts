import type { ContentBlock } from "./schema";

export const content12Key = "content-12" as const;
export const content12Namespace = "blocks.content-12" as const;

export const content12Sample: Omit<ContentBlock, "id"> = {
  type: "content-12",
  paragraphKeys: [
    "blocks.content-12.paragraphs.p1",
    "blocks.content-12.paragraphs.p2",
    "blocks.content-12.paragraphs.p3",
    "blocks.content-12.paragraphs.p4",
    "blocks.content-12.paragraphs.p5",
  ],
  readMoreLabelKey: "blocks.content-12.readMore",
  readLessLabelKey: "blocks.content-12.readLess",
};

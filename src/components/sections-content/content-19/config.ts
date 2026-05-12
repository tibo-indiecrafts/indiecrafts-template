import type { ContentBlock } from "./schema";

export const content19Key = "content-19" as const;
export const content19Namespace = "blocks.content-19" as const;

export const content19Sample: Omit<ContentBlock, "id"> = {
  type: "content-19",
  paragraphKeys: [
    "blocks.content-19.paragraphs.p1",
    "blocks.content-19.paragraphs.p2",
    "blocks.content-19.paragraphs.p3",
    "blocks.content-19.paragraphs.p4",
    "blocks.content-19.paragraphs.p5",
  ],
  readMoreLabelKey: "blocks.content-19.readMore",
  readLessLabelKey: "blocks.content-19.readLess",
};

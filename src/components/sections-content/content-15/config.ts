import type { ContentBlock } from "./schema";

export const content15Key = "content-15" as const;
export const content15Namespace = "blocks.content-15" as const;

export const content15Sample: Omit<ContentBlock, "id"> = {
  type: "content-15",
  titleKey: "blocks.content-15.title",
  bodyKeys: ["blocks.content-15.paragraphs.p1", "blocks.content-15.paragraphs.p2"],
  ctaLabelKey: "blocks.content-15.cta",
  ctaHref: "#",
};

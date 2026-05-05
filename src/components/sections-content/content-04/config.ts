import type { ContentBlock } from "./schema";

export const content04Key = "content-04" as const;
export const content04Namespace = "blocks.content-04" as const;

export const content04Sample: Omit<ContentBlock, "id"> = {
  type: "content-04",
  titleKey: "blocks.content-04.title",
  leadingKey: "blocks.content-04.leading",
  supportingKey: "blocks.content-04.supporting",
  ctaLabelKey: "blocks.content-04.cta",
  ctaHref: "#",
};

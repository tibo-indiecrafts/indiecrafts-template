import type { Content4Block } from "./schema";

export const content4Sample: Omit<Content4Block, "id"> = {
  type: "content-4",
  titleKey: "blocks.content-4.title",
  leadingKey: "blocks.content-4.leading",
  supportingKey: "blocks.content-4.supporting",
  ctaLabelKey: "blocks.content-4.cta",
  ctaHref: "#",
};

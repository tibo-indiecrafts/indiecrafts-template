import type { ContentBlock } from "./schema";

export const content24Key = "content-24" as const;
export const content24Namespace = "blocks.content-24" as const;

export const content24Sample: Omit<ContentBlock, "id"> = {
  type: "content-24",
  titleKey: "blocks.content-24.title",
  body1Key: "blocks.content-24.body1",
  body2BrandKey: "blocks.content-24.body2Brand",
  body2StrongKey: "blocks.content-24.body2Strong",
  body2RestKey: "blocks.content-24.body2Rest",
  cta: { labelKey: "blocks.content-24.cta", href: "#" },
};

import type { CallToActionBlock } from "./schema";

export const cta05Key = "cta-05" as const;
export const cta05Namespace = "blocks.cta-05" as const;

export const cta05Sample: Omit<CallToActionBlock, "id"> = {
  type: "cta-05",
  titleKey: "blocks.cta-05.title",
  bodyKey: "blocks.cta-05.body",
  primary: { labelKey: "blocks.cta-05.primary", href: "#" },
};

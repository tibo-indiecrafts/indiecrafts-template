import type { CallToActionBlock } from "./schema";

export const cta03Key = "cta-03" as const;
export const cta03Namespace = "blocks.cta-03" as const;

export const cta03Sample: Omit<CallToActionBlock, "id"> = {
  type: "cta-03",
  titleKey: "blocks.cta-03.title",
  bodyKey: "blocks.cta-03.body",
  primary: { labelKey: "blocks.cta-03.primary", href: "#" },
};

import type { CallToActionBlock } from "./schema";

export const cta12Key = "cta-12" as const;
export const cta12Namespace = "blocks.cta-12" as const;

export const cta12Sample: Omit<CallToActionBlock, "id"> = {
  type: "cta-12",
  titleKey: "blocks.cta-12.title",
  bodyKey: "blocks.cta-12.body",
  primary: { labelKey: "blocks.cta-12.primary", href: "#" },
  secondary: { labelKey: "blocks.cta-12.secondary", href: "#" },
};

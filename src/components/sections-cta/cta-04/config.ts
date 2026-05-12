import type { CallToActionBlock } from "./schema";

export const cta04Key = "cta-04" as const;
export const cta04Namespace = "blocks.cta-04" as const;

export const cta04Sample: Omit<CallToActionBlock, "id"> = {
  type: "cta-04",
  titleKey: "blocks.cta-04.title",
  bodyKey: "blocks.cta-04.body",
  primary: { labelKey: "blocks.cta-04.primary", href: "#" },
};

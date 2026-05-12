import type { CallToActionBlock } from "./schema";

export const cta10Key = "cta-10" as const;
export const cta10Namespace = "blocks.cta-10" as const;

export const cta10Sample: Omit<CallToActionBlock, "id"> = {
  type: "cta-10",
  titleKey: "blocks.cta-10.title",
  primary: { labelKey: "blocks.cta-10.primary", href: "#" },
  secondary: { labelKey: "blocks.cta-10.secondary", href: "#" },
};

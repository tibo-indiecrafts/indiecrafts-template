import type { CallToActionBlock } from "./schema";

export const cta09Key = "cta-09" as const;
export const cta09Namespace = "blocks.cta-09" as const;

export const cta09Sample: Omit<CallToActionBlock, "id"> = {
  type: "cta-09",
  eyebrowKey: "blocks.cta-09.eyebrow",
  titleKey: "blocks.cta-09.title",
  bodyKey: "blocks.cta-09.body",
  cta: { labelKey: "blocks.cta-09.cta", href: "#" },
};

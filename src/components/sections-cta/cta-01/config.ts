import type { CallToActionBlock } from "./schema";

export const cta01Key = "cta-01" as const;
export const cta01Namespace = "blocks.cta-01" as const;

export const cta01Sample: Omit<CallToActionBlock, "id"> = {
  type: "cta-01",
  titleKey: "blocks.cta-01.title",
  bodyKey: "blocks.cta-01.body",
  emailPlaceholderKey: "blocks.cta-01.emailPlaceholder",
  submitLabelKey: "blocks.cta-01.submit",
};

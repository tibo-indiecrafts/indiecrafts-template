import type { CallToActionBlock } from "./schema";

export const cta08Key = "cta-08" as const;
export const cta08Namespace = "blocks.cta-08" as const;

export const cta08Sample: Omit<CallToActionBlock, "id"> = {
  type: "cta-08",
  titleKey: "blocks.cta-08.title",
  bodyKey: "blocks.cta-08.body",
  emailLabelKey: "blocks.cta-08.emailLabel",
  emailPlaceholderKey: "blocks.cta-08.emailPlaceholder",
  cta: { labelKey: "blocks.cta-08.cta", href: "#" },
};

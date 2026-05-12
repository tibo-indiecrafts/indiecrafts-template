import type { CallToActionBlock } from "./schema";

export const cta06Key = "cta-06" as const;
export const cta06Namespace = "blocks.cta-06" as const;

export const cta06Sample: Omit<CallToActionBlock, "id"> = {
  type: "cta-06",
  titleKey: "blocks.cta-06.title",
  bodyKey: "blocks.cta-06.body",
  primary: { labelKey: "blocks.cta-06.primary", href: "#" },
};

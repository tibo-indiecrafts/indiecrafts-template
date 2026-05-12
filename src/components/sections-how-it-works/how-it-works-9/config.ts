import type { HowItWorks9Block } from "./schema";

export const howItWorks9Key = "how-it-works-9" as const;
export const howItWorks9Namespace = "blocks.how-it-works-9" as const;

export const howItWorks9Sample: Omit<HowItWorks9Block, "id"> = {
  type: "how-it-works-9",
  ctaLabelKey: "blocks.how-it-works-9.cta",
  ctaHref: "#",
};

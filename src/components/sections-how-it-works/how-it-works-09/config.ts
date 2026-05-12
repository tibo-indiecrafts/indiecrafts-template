import type { HowItWorks09Block } from "./schema";

export const howItWorks09Key = "how-it-works-09" as const;
export const howItWorks09Namespace = "blocks.how-it-works-09" as const;

export const howItWorks09Sample: Omit<HowItWorks09Block, "id"> = {
  type: "how-it-works-09",
  ctaLabelKey: "blocks.how-it-works-09.cta",
  ctaHref: "#",
};

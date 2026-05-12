import type { CallToActionBlock } from "./schema";

export const cta02Key = "cta-02" as const;
export const cta02Namespace = "blocks.cta-02" as const;

export const cta02Sample: Omit<CallToActionBlock, "id"> = {
  type: "cta-02",
  headline: {
    firstKey: "blocks.cta-02.headline.first",
    accentKey: "blocks.cta-02.headline.accent",
  },
  bodyKey: "blocks.cta-02.body",
  primary: { labelKey: "blocks.cta-02.primary", href: "#" },
  secondary: { labelKey: "blocks.cta-02.secondary", href: "#" },
};

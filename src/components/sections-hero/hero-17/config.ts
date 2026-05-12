import type { HeroBlock } from "./schema";

export const hero17Key = "hero-17" as const;
export const hero17Namespace = "blocks.hero-17" as const;

export const hero17Sample: Omit<HeroBlock, "id"> = {
  type: "hero-17",
  headline: {
    firstKey: "blocks.hero-17.headline.first",
    firstSuffixKey: "blocks.hero-17.headline.firstSuffix",
    middleKey: "blocks.hero-17.headline.middle",
    accentKey: "blocks.hero-17.headline.accent",
  },
  bodyKey: "blocks.hero-17.body",
  primary: { labelKey: "blocks.hero-17.primary", href: "#" },
  secondary: { labelKey: "blocks.hero-17.secondary", href: "#" },
};

import type { HeroBlock } from "./schema";

export const hero18Key = "hero-18" as const;
export const hero18Namespace = "blocks.hero-18" as const;

export const hero18Sample: Omit<HeroBlock, "id"> = {
  type: "hero-18",
  headline: {
    firstKey: "blocks.hero-18.headline.first",
    accentKey: "blocks.hero-18.headline.accent",
  },
  bodyKey: "blocks.hero-18.body",
  primary: { labelKey: "blocks.hero-18.primary", href: "#" },
  subtextKey: "blocks.hero-18.subtext",
  imageAltKey: "blocks.hero-18.imageAlt",
};

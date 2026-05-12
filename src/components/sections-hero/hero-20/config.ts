import type { HeroBlock } from "./schema";

export const hero20Key = "hero-20" as const;
export const hero20Namespace = "blocks.hero-20" as const;

export const hero20Sample: Omit<HeroBlock, "id"> = {
  type: "hero-20",
  headline: {
    firstKey: "blocks.hero-20.headline.first",
    accentKey: "blocks.hero-20.headline.accent",
    restKey: "blocks.hero-20.headline.rest",
  },
  bodyKey: "blocks.hero-20.body",
  primary: { labelKey: "blocks.hero-20.primary", href: "#" },
};

import type { HeroBlock } from "./schema";

export const hero19Key = "hero-19" as const;
export const hero19Namespace = "blocks.hero-19" as const;

export const hero19Sample: Omit<HeroBlock, "id"> = {
  type: "hero-19",
  headline: {
    firstAccentKey: "blocks.hero-19.headline.firstAccent",
    restKey: "blocks.hero-19.headline.rest",
  },
  bodyKey: "blocks.hero-19.body",
  primary: { labelKey: "blocks.hero-19.primary", href: "#" },
  subtextKey: "blocks.hero-19.subtext",
};

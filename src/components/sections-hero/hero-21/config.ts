import type { HeroBlock } from "./schema";

export const hero21Key = "hero-21" as const;
export const hero21Namespace = "blocks.hero-21" as const;

export const hero21Sample: Omit<HeroBlock, "id"> = {
  type: "hero-21",
  titleKey: "blocks.hero-21.title",
  bodyKey: "blocks.hero-21.body",
  primary: { labelKey: "blocks.hero-21.primary", href: "#" },
  secondary: { labelKey: "blocks.hero-21.secondary", href: "#" },
  imageAltKey: "blocks.hero-21.imageAlt",
};

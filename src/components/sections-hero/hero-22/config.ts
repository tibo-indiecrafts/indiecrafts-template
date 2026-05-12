import type { HeroBlock } from "./schema";

export const hero22Key = "hero-22" as const;
export const hero22Namespace = "blocks.hero-22" as const;

export const hero22Sample: Omit<HeroBlock, "id"> = {
  type: "hero-22",
  titleKey: "blocks.hero-22.title",
  bodyKey: "blocks.hero-22.body",
  primary: { labelKey: "blocks.hero-22.primary", href: "#" },
  secondary: { labelKey: "blocks.hero-22.secondary", href: "#" },
  imageSrc:
    "https://images.unsplash.com/photo-1586173806725-797f4d632f5d?q=80&w=2388&auto=format&fit=crop",
  imageAltKey: "blocks.hero-22.imageAlt",
  logoStripLabelKey: "blocks.hero-22.logoStripLabel",
};

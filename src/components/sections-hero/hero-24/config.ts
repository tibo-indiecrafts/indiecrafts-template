import type { HeroBlock } from "./schema";

export const hero24Key = "hero-24" as const;
export const hero24Namespace = "blocks.hero-24" as const;

export const hero24Sample: Omit<HeroBlock, "id"> = {
  type: "hero-24",
  announcement: {
    badgeKey: "blocks.hero-24.announcementBadge",
    labelKey: "blocks.hero-24.announcementLabel",
    href: "#",
  },
  titleKey: "blocks.hero-24.title",
  bodyKey: "blocks.hero-24.body",
  emailPlaceholderKey: "blocks.hero-24.emailPlaceholder",
  submitLabelKey: "blocks.hero-24.submitLabel",
  submitAriaLabelKey: "blocks.hero-24.submitAriaLabel",
  bullets: [
    "blocks.hero-24.bullets.1",
    "blocks.hero-24.bullets.2",
    "blocks.hero-24.bullets.3",
  ],
  imageDarkSrc: "/placeholder.svg",
  imageLightSrc: "/placeholder.svg",
  imageAltKey: "blocks.hero-24.imageAlt",
};

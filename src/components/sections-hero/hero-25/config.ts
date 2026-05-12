import type { HeroBlock } from "./schema";

export const hero25Key = "hero-25" as const;
export const hero25Namespace = "blocks.hero-25" as const;

export const hero25Sample: Omit<HeroBlock, "id"> = {
  type: "hero-25",
  announcement: {
    badgeKey: "blocks.hero-25.announcementBadge",
    labelKey: "blocks.hero-25.announcementLabel",
    href: "#",
  },
  titleKey: "blocks.hero-25.title",
  bodyDesktopKey: "blocks.hero-25.bodyDesktop",
  bodyMobileKey: "blocks.hero-25.bodyMobile",
  primary: { labelKey: "blocks.hero-25.primary", href: "#" },
  imageDarkSrc: "/placeholder.svg",
  imageLightSrc: "/placeholder.svg",
  imageAltKey: "blocks.hero-25.imageAlt",
  partnersHeadingKey: "blocks.hero-25.partnersHeading",
};

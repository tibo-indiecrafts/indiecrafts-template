import type { HeroBlock } from "./schema";

export const hero23Key = "hero-23" as const;
export const hero23Namespace = "blocks.hero-23" as const;

export const hero23Sample: Omit<HeroBlock, "id"> = {
  type: "hero-23",
  titleKey: "blocks.hero-23.title",
  bodyKey: "blocks.hero-23.body",
  primary: { labelKey: "blocks.hero-23.primary", href: "#" },
  secondary: { labelKey: "blocks.hero-23.secondary", href: "#" },
  videoSrc: "https://videos.pexels.com/video-files/35968183/15249566_1920_1080_30fps.mp4",
  logoStripLabelKey: "blocks.hero-23.logoStripLabel",
};

import type { WelcomeBannerBlock, WelcomeBannerChip } from "./schema";

export const welcomeBanner01Key = "welcome-banner-01" as const;
export const welcomeBanner01Namespace = "blocks.welcome-banner-01" as const;

export const welcomeBanner01Chips: WelcomeBannerChip[] = [
  { id: "tour", iconKey: "Sparkles", href: "/" },
  { id: "docs", iconKey: "BookOpen", href: "/" },
  { id: "settings", iconKey: "Cog", href: "/" },
  { id: "support", iconKey: "LifeBuoy", href: "/" },
];

export const welcomeBanner01Sample: Omit<WelcomeBannerBlock, "id"> = {
  type: "welcome-banner-01",
  chips: welcomeBanner01Chips,
};

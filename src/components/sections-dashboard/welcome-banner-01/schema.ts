import type { MessageKey } from "@/types/messages";

export type WelcomeBannerIcon =
  | "Sparkles"
  | "BookOpen"
  | "Cog"
  | "LifeBuoy"
  | "Rocket"
  | "Zap";

export type WelcomeBannerChip = {
  id: string;

  iconKey: WelcomeBannerIcon;

  href?: string;
};

export type WelcomeBannerBlock = {
  type: "welcome-banner-01";
  id: string;

  titleKey?: MessageKey;

  descriptionKey?: MessageKey;

  greetingKey?: MessageKey;

  userName?: string;

  chips?: WelcomeBannerChip[];
};

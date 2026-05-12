import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

export type HeroBlock = {
  type: "hero-25";
  id: string;
  announcement: {
    badgeKey: MessageKey;
    labelKey: MessageKey;
    href: StaticAppPathname | `http${string}` | `#${string}`;
  };
  titleKey: MessageKey;
  bodyDesktopKey: MessageKey;
  bodyMobileKey: MessageKey;
  primary: {
    labelKey: MessageKey;
    href: StaticAppPathname | `http${string}` | `#${string}`;
  };
  imageDarkSrc: string;
  imageLightSrc: string;
  imageAltKey: MessageKey;
  partnersHeadingKey: MessageKey;
};

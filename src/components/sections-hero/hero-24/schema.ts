import type { StaticAppPathname } from "@/config";
import type { MessageKey } from "@/types/messages";

export type HeroBlock = {
  type: "hero-24";
  id: string;
  announcement: {
    badgeKey: MessageKey;
    labelKey: MessageKey;
    href: StaticAppPathname | `http${string}` | `#${string}`;
  };
  titleKey: MessageKey;
  bodyKey: MessageKey;
  emailPlaceholderKey: MessageKey;
  submitLabelKey: MessageKey;
  submitAriaLabelKey: MessageKey;
  bullets: ReadonlyArray<MessageKey>;
  imageDarkSrc: string;
  imageLightSrc: string;
  imageAltKey: MessageKey;
};

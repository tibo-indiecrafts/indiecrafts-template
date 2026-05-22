import type { StaticAppPathname } from "@/config";
import type { MessageKey } from "@/types/messages";

export type HeroBlock = {
  type: "hero-21";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  primary: {
    labelKey: MessageKey;
    href: StaticAppPathname | `http${string}` | `#${string}`;
  };
  secondary: {
    labelKey: MessageKey;
    href: StaticAppPathname | `http${string}` | `#${string}`;
  };
  imageAltKey: MessageKey;
};

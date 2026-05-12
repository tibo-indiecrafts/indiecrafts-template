import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

export type HeroBlock = {
  type: "hero-17";
  id: string;
  headline: {
    firstKey: MessageKey;
    firstSuffixKey?: MessageKey;
    middleKey: MessageKey;
    accentKey: MessageKey;
  };
  bodyKey: MessageKey;
  primary: {
    labelKey: MessageKey;
    href: StaticAppPathname | `http${string}` | `#${string}`;
  };
  secondary: {
    labelKey: MessageKey;
    href: StaticAppPathname | `http${string}` | `#${string}`;
  };
};

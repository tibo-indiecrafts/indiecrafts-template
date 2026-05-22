import type { StaticAppPathname } from "@/config";
import type { MessageKey } from "@/types/messages";

export type HeroBlock = {
  type: "hero-19";
  id: string;
  headline: {
    firstAccentKey: MessageKey;
    restKey: MessageKey;
  };
  bodyKey: MessageKey;
  primary: {
    labelKey: MessageKey;
    href: StaticAppPathname | `http${string}` | `#${string}`;
  };
  subtextKey: MessageKey;
};

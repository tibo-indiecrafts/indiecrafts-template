import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

export type HeroBlock = {
  type: "hero-20";
  id: string;
  headline: { firstKey: MessageKey; accentKey: MessageKey; restKey: MessageKey };
  bodyKey: MessageKey;
  primary: {
    labelKey: MessageKey;
    href: StaticAppPathname | `http${string}` | `#${string}`;
  };
};

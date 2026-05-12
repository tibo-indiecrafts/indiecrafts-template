import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

export type CallToActionBlock = {
  type: "cta-11";
  id: string;
  /** Muted prefix line of the headline. */
  titleMutedKey: MessageKey;
  /** Foreground emphasis tail of the headline. */
  titleAccentKey: MessageKey;
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

import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

export type CallToActionBlock = {
  type: "cta-11";
  id: string;

  titleMutedKey: MessageKey;

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

import type { StaticAppPathname } from "@/config";
import type { MessageKey } from "@/types/messages";

export type CallToActionBlock = {
  type: "cta-10";
  id: string;
  titleKey: MessageKey;
  primary: {
    labelKey: MessageKey;
    href: StaticAppPathname | `http${string}` | `#${string}`;
  };
  secondary: {
    labelKey: MessageKey;
    href: StaticAppPathname | `http${string}` | `#${string}`;
  };
};

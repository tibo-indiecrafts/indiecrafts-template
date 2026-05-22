import type { StaticAppPathname } from "@/config";
import type { MessageKey } from "@/types/messages";

export type CallToActionBlock = {
  type: "cta-04";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  primary: {
    labelKey: MessageKey;
    href: StaticAppPathname | `http${string}` | `#${string}`;
  };
};

import type { StaticAppPathname } from "@/config";
import type { MessageKey } from "@/types/messages";

export type CallToActionBlock = {
  type: "cta-09";
  id: string;
  eyebrowKey: MessageKey;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  cta: { labelKey: MessageKey; href: StaticAppPathname | `http${string}` | `#${string}` };
};

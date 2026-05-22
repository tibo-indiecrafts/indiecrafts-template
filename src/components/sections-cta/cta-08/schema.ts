import type { StaticAppPathname } from "@/config";
import type { MessageKey } from "@/types/messages";

export type CallToActionBlock = {
  type: "cta-08";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  emailPlaceholderKey: MessageKey;
  emailLabelKey: MessageKey;
  cta: { labelKey: MessageKey; href: StaticAppPathname | `http${string}` | `#${string}` };
};

import type { StaticAppPathname } from "@/config";
import type { MessageKey } from "@/types/messages";

export type ContentBlock = {
  type: "content-03";
  id: string;
  titleKey?: MessageKey;
  bodyKey?: MessageKey;
  ctaLabelKey?: MessageKey;
  ctaHref: StaticAppPathname | `http${string}` | `#${string}`;
  imageUrl: string;
  imageAltKey?: MessageKey;
};

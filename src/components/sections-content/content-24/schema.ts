import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

export type ContentBlock = {
  type: "content-24";
  id: string;
  titleKey: MessageKey;
  body1Key: MessageKey;
  body2BrandKey: MessageKey;
  body2StrongKey: MessageKey;
  body2RestKey: MessageKey;
  cta: { labelKey: MessageKey; href: StaticAppPathname | `http${string}` | `#${string}` };
};

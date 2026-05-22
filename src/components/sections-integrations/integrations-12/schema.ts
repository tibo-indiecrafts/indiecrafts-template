import type { StaticAppPathname } from "@/config";
import type { MessageKey } from "@/types/messages";

export type IntegrationsBlock = {
  type: "integrations-12";
  id: string;
  ctaLabelKey: MessageKey;
  ctaHref: StaticAppPathname | `http${string}` | `#${string}`;
};

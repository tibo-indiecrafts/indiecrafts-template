import type { StaticAppPathname } from "@/config";
import type { MessageKey } from "@/types/messages";

export type HowItWorks09Block = {
  type: "how-it-works-09";
  id: string;
  ctaLabelKey: MessageKey;
  ctaHref: StaticAppPathname | `http${string}` | `#${string}`;
};

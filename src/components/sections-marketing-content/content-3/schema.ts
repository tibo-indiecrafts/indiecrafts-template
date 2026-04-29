import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

/**
 * Tailark `content-3` — full-width hero image, then 2-column layout with
 * heading on the left and copy + CTA on the right.
 */
export type Content3Block = {
  type: "content-3";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  ctaLabelKey: MessageKey;
  ctaHref: StaticAppPathname | `http${string}` | `#${string}`;
  imageUrl: string;
  imageAltKey: MessageKey;
};

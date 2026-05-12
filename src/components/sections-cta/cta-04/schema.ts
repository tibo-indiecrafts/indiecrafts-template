import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

/**
 * Tailark Pro `grid-2-landing-one` CallToAction — JSX verbatim.
 * Two `Separator h-16` rails sandwich a centered Container card
 * with title/body/CTA.
 */
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

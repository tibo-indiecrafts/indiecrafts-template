import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

/**
 * Tailark Pro `grid-1-landing-one` CallToAction — JSX verbatim.
 * Two stacked Containers: a 16-py spacer above, then a wide
 * gradient-tinted card with masked Unsplash backdrop, headline +
 * body + single CTA on the left, and the `LayoutIllustration`
 * floating in from the right at @lg.
 */
export type CallToActionBlock = {
  type: "cta-03";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  primary: {
    labelKey: MessageKey;
    href: StaticAppPathname | `http${string}` | `#${string}`;
  };
};

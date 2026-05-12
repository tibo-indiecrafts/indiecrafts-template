import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

/**
 * Tailark Pro `grid-2-landing-one` hero — JSX verbatim. The
 * grid-shaped Container layout with a masked Unsplash backdrop
 * behind the title block, plus 2 `FeatureCard` tiles below.
 * Headline shape: `firstAccent` (hidden on @max-md) + `rest`.
 */
export type HeroBlock = {
  type: "hero-19";
  id: string;
  headline: {
    firstAccentKey: MessageKey;
    restKey: MessageKey;
  };
  bodyKey: MessageKey;
  primary: {
    labelKey: MessageKey;
    href: StaticAppPathname | `http${string}` | `#${string}`;
  };
  subtextKey: MessageKey;
};

import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

/**
 * Tailark Pro `grid-1-landing-one` hero — JSX kept verbatim
 * against the inline section in upstream `page.tsx`. Bordered
 * grid backdrop with masked X-lines, centered headline (split
 * across muted/foreground span), body, single primary CTA, and
 * a "no credit card" subtext, plus the wide product mock framed
 * inside a Container.
 */
export type HeroBlock = {
  type: "hero-18";
  id: string;
  headline: {
    firstKey: MessageKey;
    accentKey: MessageKey;
  };
  bodyKey: MessageKey;
  primary: {
    labelKey: MessageKey;
    href: StaticAppPathname | `http${string}` | `#${string}`;
  };
  subtextKey: MessageKey;
  imageAltKey: MessageKey;
};

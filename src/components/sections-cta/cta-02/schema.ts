import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

/**
 * Tailark Pro `dark-landing-one` closing CTA — JSX verbatim.
 * Centered headline with gradient-stroked accent + body + dual
 * CTAs (primary + glass-outline secondary).
 */
export type CallToActionBlock = {
  type: "cta-02";
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
  secondary: {
    labelKey: MessageKey;
    href: StaticAppPathname | `http${string}` | `#${string}`;
  };
};

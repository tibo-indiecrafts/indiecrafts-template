import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

/**
 * Tailark Pro `dark-landing-one` hero — stripped to neutral
 * (no constellation background, no inline product mock). 3-part
 * headline (`first` + optional inline `firstSuffix` that hides
 * under `md` + `middle` + gradient-stroked `accent`), body, and
 * dual CTAs (primary solid + glass-outline secondary).
 */
export type HeroBlock = {
  type: "hero-17";
  id: string;
  headline: {
    firstKey: MessageKey;
    firstSuffixKey?: MessageKey;
    middleKey: MessageKey;
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

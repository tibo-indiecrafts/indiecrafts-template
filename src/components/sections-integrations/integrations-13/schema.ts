import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

/**
 * Tailark Pro `grid-2-landing-one` IntegrationsSection — JSX
 * verbatim. Intro + outline CTA above a 4-cell hover-reveal grid
 * (split between Platform and LLMs columns).
 */
export type IntegrationsBlock = {
  type: "integrations-13";
  id: string;
  ctaLabelKey: MessageKey;
  ctaHref: StaticAppPathname | `http${string}` | `#${string}`;
};

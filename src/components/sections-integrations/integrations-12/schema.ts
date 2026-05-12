import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

/**
 * Tailark Pro `grid-1-landing-one` IntegrationsSection — JSX
 * verbatim. Eyebrow + intro + outline CTA above a sparse 12-column
 * grid of integration logo cells (some highlighted with a card
 * surface, others left as bordered tiles). Cell layout is
 * positional inside the .tsx file.
 */
export type IntegrationsBlock = {
  type: "integrations-12";
  id: string;
  ctaLabelKey: MessageKey;
  ctaHref: StaticAppPathname | `http${string}` | `#${string}`;
};
